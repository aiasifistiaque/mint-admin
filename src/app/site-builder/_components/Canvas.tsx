'use client';

import { FC, memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import type { SbNode } from '@/components/library/store/services/siteBuilderApi';
import { SITES_ORIGIN, SITES_URL, isCanvasMessage, type CanvasDesign, type CanvasLayout, type PanelMessage } from './protocol';

/**
 * The canvas (docs/site-builder D9): the renderer's /__mint/edit page in a
 * frame, so what you edit is drawn by the same blocks and theme as the live
 * site. The panel owns the draft and sends it; the canvas reports clicks and
 * hovers. A device narrower than the frame shows at its own width; a wider
 * one is scaled down to fit.
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
	onSelect: (id: string, shift: boolean) => void;
	onHover: (id: string | null) => void;
};

const Canvas: FC<Props> = ({ tree, layout, design, links, theme, device, selectedId, hoveredId, onSelect, onHover }) => {
	const frame = useRef<HTMLIFrameElement>(null);
	const area = useRef<HTMLDivElement>(null);
	const [ready, setReady] = useState(false);
	const [failed, setFailed] = useState(false);
	const [areaW, setAreaW] = useState(0);
	const [areaH, setAreaH] = useState(0);
	// The latest props, for the 'ready' handler (it may come before or after they change).
	const latest = useRef({ tree, layout, design, links, theme, selectedId });
	latest.current = { tree, layout, design, links, theme, selectedId };
	const handlers = useRef({ onSelect, onHover });
	handlers.current = { onSelect, onHover };

	const send = (msg: PanelMessage) => frame.current?.contentWindow?.postMessage(msg, SITES_ORIGIN);

	useEffect(() => {
		const onMessage = (e: MessageEvent) => {
			if (e.origin !== SITES_ORIGIN || e.source !== frame.current?.contentWindow || !isCanvasMessage(e.data)) return;
			const m = e.data;
			if (m.type === 'ready') {
				const l = latest.current;
				if (!l.design) return;
				send({ mint: 1, type: 'init', design: l.design, layout: l.layout, page: { tree: l.tree }, links: l.links, theme: l.theme });
				if (l.selectedId) send({ mint: 1, type: 'select', id: l.selectedId });
				setReady(true);
				setFailed(false);
			} else if (m.type === 'click') handlers.current.onSelect(m.id, m.shift);
			else if (m.type === 'hover') handlers.current.onHover(m.id);
		};
		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	}, []);

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
};

export default memo(Canvas);
