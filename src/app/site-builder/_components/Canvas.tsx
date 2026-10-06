'use client';

import { forwardRef, memo, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import type { SbNode } from '@/components/library/store/services/siteBuilderApi';
import { SITES_ORIGIN, SITES_URL, isCanvasMessage, type CanvasDesign, type CanvasLayout, type CanvasMessage, type DragItem, type DropTarget, type PanelMessage } from './protocol';

/**
 * The canvas (docs/site-builder D9): the renderer's /__mint/edit page in a
 * frame, so what you edit is drawn by the same blocks and theme as the live
 * site. The panel owns the draft and sends it; the canvas reports clicks and
 * hovers. A device narrower than the frame shows at its own width; a wider
 * one is scaled down to fit. SB-06: drags from the Add panel go through the
 * handle (`toCanvas` / `drag` / `dragEnd`); the canvas answers with drop
 * targets, moves, typed text and shortcuts.
 */

export type Device = 'mobile' | 'tablet' | 'desktop' | 'fit';
export const DEVICE_WIDTH: Record<Exclude<Device, 'fit'>, number> = { mobile: 390, tablet: 768, desktop: 1280 };

type Props = {
	tree: SbNode[];
	layout: CanvasLayout;
	design: CanvasDesign | null;
	links: Record<string, string>;
	theme: 'light' | 'dark';
	device: Device;
	selectedId: string | null;
	hoveredId: string | null;
	readOnly: boolean;
	/** the overlay to show (a pop-up, drawer or popover — or the one holding the selection) */
	openId: string | null;
	/** a drag from the Add panel is under way: a cover keeps the pointer's events in the panel */
	dragging: boolean;
	onSelect: (id: string, shift: boolean) => void;
	onHover: (id: string | null) => void;
	onDropTarget: (target: DropTarget | null, reason?: string) => void;
	onMove: (id: string, target: DropTarget) => void;
	onText: (id: string, prop: string, value: string) => void;
	onKey: (key: Extract<CanvasMessage, { type: 'key' }>) => void;
};

export type CanvasHandle = {
	/** The point in the canvas's own viewport, or null when (clientX, clientY) is outside it. */
	toCanvas: (clientX: number, clientY: number) => { x: number; y: number } | null;
	drag: (x: number, y: number, item: DragItem) => void;
	dragEnd: () => void;
};

const Canvas = forwardRef<CanvasHandle, Props>(function Canvas(
	{ tree, layout, design, links, theme, device, selectedId, hoveredId, readOnly, openId, dragging, onSelect, onHover, onDropTarget, onMove, onText, onKey },
	ref
) {
	const frame = useRef<HTMLIFrameElement>(null);
	const area = useRef<HTMLDivElement>(null);
	const [ready, setReady] = useState(false);
	const [failed, setFailed] = useState(false);
	const [areaW, setAreaW] = useState(0);
	const [areaH, setAreaH] = useState(0);
	// The latest props, for the 'ready' handler (it may come before or after they change).
	const latest = useRef({ tree, layout, design, links, theme, selectedId });
	latest.current = { tree, layout, design, links, theme, selectedId };
	const handlers = useRef({ onSelect, onHover, onDropTarget, onMove, onText, onKey });
	handlers.current = { onSelect, onHover, onDropTarget, onMove, onText, onKey };
	const readOnlyRef = useRef(readOnly);
	readOnlyRef.current = readOnly;

	const send = (msg: PanelMessage) => frame.current?.contentWindow?.postMessage(msg, SITES_ORIGIN);
	// The frame said 'ready' before the design had loaded: start it once the design arrives.
	const waiting = useRef(false);

	const init = () => {
		const l = latest.current;
		if (!l.design) {
			waiting.current = true;
			return;
		}
		waiting.current = false;
		send({ mint: 1, type: 'init', design: l.design, layout: l.layout, page: { tree: l.tree }, links: l.links, theme: l.theme, readOnly: readOnlyRef.current });
		if (l.selectedId) send({ mint: 1, type: 'select', id: l.selectedId });
		setReady(true);
		setFailed(false);
	};
	const initRef = useRef(init);
	initRef.current = init;

	useEffect(() => {
		const onMessage = (e: MessageEvent) => {
			if (e.origin !== SITES_ORIGIN || e.source !== frame.current?.contentWindow || !isCanvasMessage(e.data)) return;
			const m = e.data;
			if (m.type === 'ready') initRef.current();
			else if (m.type === 'click') handlers.current.onSelect(m.id, m.shift);
			else if (m.type === 'hover') handlers.current.onHover(m.id);
			else if (m.type === 'dropTarget') handlers.current.onDropTarget(m.target, m.reason);
			else if (m.type === 'move') handlers.current.onMove(m.id, { parentId: m.parentId, index: m.index, ...(m.slot && { slot: m.slot }) });
			else if (m.type === 'text') handlers.current.onText(m.id, m.prop, m.value);
			else if (m.type === 'key') handlers.current.onKey(m);
		};
		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	}, []);

	useEffect(() => {
		if (design && waiting.current) init();
	}, [design]); // eslint-disable-line react-hooks/exhaustive-deps

	// No 'ready' within a while: the renderer isn't reachable (or doesn't allow this panel).
	useEffect(() => {
		if (ready) return;
		const t = setTimeout(() => setFailed(true), 8000);
		return () => clearTimeout(t);
	}, [ready]);

	// A draft or design that arrives after the canvas is up.
	useEffect(() => {
		if (ready && design) send({ mint: 1, type: 'tree', tree, layout });
	}, [tree, layout, ready]); // eslint-disable-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (ready && design) send({ mint: 1, type: 'design', design });
	}, [design, ready]);
	useEffect(() => {
		if (ready) send({ mint: 1, type: 'theme', theme });
	}, [theme, ready]);
	useEffect(() => {
		if (ready) send({ mint: 1, type: 'select', id: selectedId });
	}, [selectedId, ready]);
	useEffect(() => {
		if (ready) send({ mint: 1, type: 'hover', id: hoveredId });
	}, [hoveredId, ready]);
	useEffect(() => {
		if (ready) send({ mint: 1, type: 'open', id: openId });
	}, [openId, ready]);

	useImperativeHandle(
		ref,
		() => ({
			toCanvas: (clientX, clientY) => {
				const f = frame.current;
				if (!f) return null;
				const r = f.getBoundingClientRect();
				if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return null;
				const scale = r.width / (f.offsetWidth || r.width);
				return { x: (clientX - r.left) / scale, y: (clientY - r.top) / scale };
			},
			drag: (x, y, item) => send({ mint: 1, type: 'drag', x, y, item }),
			dragEnd: () => send({ mint: 1, type: 'dragend' }),
		}),
		[]
	);

	useLayoutEffect(() => {
		const el = area.current;
		if (!el) return;
		const ro = new ResizeObserver(() => {
			setAreaW(el.clientWidth);
			setAreaH(el.clientHeight);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	const pad = 24;
	const avail = Math.max(320, areaW - pad * 2);
	const width = device === 'fit' ? avail : DEVICE_WIDTH[device];
	const scale = width > avail ? avail / width : 1;
	const height = Math.max(400, (areaH - pad * 2) / scale);

	return (
		<Box
			ref={area}
			position='relative'
			flex={1}
			minW={0}
			h='full'
			overflow='hidden'
			bg='bg.muted'>
			<Box
				position='absolute'
				top={`${pad}px`}
				left='50%'
				w={`${width}px`}
				h={`${height}px`}
				transform={`translateX(-50%) scale(${scale})`}
				transformOrigin='top center'
				borderRadius='md'
				overflow='hidden'
				boxShadow='md'
				bg='white'>
				<iframe
					ref={frame}
					src={`${SITES_URL}/__mint/edit`}
					title='Page canvas'
					style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
				/>
			</Box>
			{dragging && (
				<Box
					position='absolute'
					inset={0}
					zIndex={2}
					cursor='copy'
				/>
			)}
			{!ready && (
				<Flex
					position='absolute'
					inset={0}
					align='center'
					justify='center'
					direction='column'
					gap={2}
					pointerEvents='none'>
					{failed ? (
						<Text
							fontSize='13px'
							color='fg.muted'
							maxW='380px'
							textAlign='center'
							bg='bg.panel'
							p={3}
							borderRadius='md'
							borderWidth='1px'>
							The canvas didn’t load from {SITES_URL}. The site renderer may be down, or not set up to allow this panel.
						</Text>
					) : (
						<Spinner size='sm' />
					)}
				</Flex>
			)}
		</Box>
	);
});

export default memo(Canvas);
