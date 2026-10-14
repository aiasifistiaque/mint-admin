'use client';
import { FC, FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import { Button, IconButton, Spinner, Text } from '@chakra-ui/react';
import { Plus } from 'lucide-react';
import {
	Dialog,
	DialogBody,
	DialogCloseButton,
	DialogFooter,
	DialogHeader,
	DiscardButton,
	FormMain,
	ModalFormSection,
	styles,
	useGetConfigQuery,
	usePostMutation,
} from '../..';
import { useCustomToast, useIsMobile } from '../../hooks';
import { Tooltip } from '@/components/ui/tooltip';

type Props = {
	/** The linked model's route, e.g. "categories". */
	model: string;
	/** What one record is called, for the tooltip and the title: "Category". */
	label?: string;
	/** Values the new record starts with (the picker's conditions). */
	prefill?: Record<string, any>;
	disabled?: boolean;
	/** The record as saved — the picker selects it. */
	onCreated: (doc: any) => void;
};

/**
 * The + beside a record picker: a modal with the linked model's create form.
 * Saved, the new record is handed back to the picker, which selects it.
 *
 * Portalled, but React events still bubble up the component tree — so the
 * submit stops here and doesn't also submit the form the picker sits in.
 */
const QuickAdd: FC<Props> = ({ model, label, prefill, disabled, onCreated }) => {
	const [open, setOpen] = useState(false);
	const { data, isFetching, isError } = useGetConfigQuery(model, { skip: !open || !model });
	const [formData, setFormData] = useState<any>({});
	const [, setChangedData] = useState<any>({});
	const [callApi, result] = usePostMutation();
	const isMobile = useIsMobile();
	const name = label || 'record';

	useCustomToast({ successText: `${name} added`, ...result });

	// The form's own defaults, then the picker's conditions — set once the form is known.
	useEffect(() => {
		if (!open || !data?.form) return;
		const defaults: any = {};
		for (const f of data.form) if (f?.value !== undefined) defaults[f.name] = f.value;
		setFormData({ ...defaults, ...(prefill || {}) });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, data]);

	useEffect(() => {
		if (!result.isSuccess || result.isLoading) return;
		const doc = result.data?.doc;
		if (doc) onCreated(doc);
		setOpen(false);
		result.reset();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [result.isSuccess, result.isLoading]);

	const submit = (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const body = { ...formData };
		for (const f of data?.form || []) if (f?.isExcluded) delete body[f.name];
		callApi({ path: model, body });
	};

	// Enter in a text input would submit half a record.
	const keyDown = (e: KeyboardEvent<HTMLFormElement>) => {
		if (e.key === 'Enter' && (e.target as HTMLElement)?.tagName === 'INPUT') e.preventDefault();
	};

	return (
		<>
			<Tooltip
				content={`Add a new ${name.toLowerCase()}`}
				openDelay={300}>
				<IconButton
					type='button'
					size='sm'
					variant='outline'
					flexShrink={0}
					aria-label={`Add a new ${name.toLowerCase()}`}
					disabled={disabled || !model}
					onClick={() => setOpen(true)}>
					<Plus size={16} />
				</IconButton>
			</Tooltip>

			<Dialog
				isOpen={open}
				onClose={() => {
					setOpen(false);
					result.reset();
				}}>
				<form
					onSubmit={submit}
					onKeyDown={keyDown}>
					<DialogHeader
						divider
						icon={<Plus size={18} strokeWidth={1.75} />}>
						New {name.toLowerCase()}
					</DialogHeader>
					<DialogCloseButton top={{ base: 4, md: 5 }} />
					<DialogBody pt={{ base: 4, md: 5 }}>
						{isFetching || !data ? (
							isError ? (
								<Text
									fontSize='sm'
									color='red.fg'>
									Couldn&apos;t load the form for {model}.
								</Text>
							) : (
								<Spinner size='sm' />
							)
						) : (
							<ModalFormSection>
								<FormMain
									fields={data?.form || []}
									formData={formData}
									setFormData={setFormData}
									setChangedData={setChangedData}
									isModal={true}
								/>
							</ModalFormSection>
						)}
					</DialogBody>
					<DialogFooter>
						{!isMobile && (
							<DiscardButton
								disabled={result.isLoading}
								onClick={() => setOpen(false)}>
								Cancel
							</DiscardButton>
						)}
						<Button
							{...(styles.MODAL_BUTTON as any)}
							{...(isMobile && { w: 'full' })}
							type='submit'
							disabled={!data?.form}
							loading={result.isLoading}
							loadingText='Adding'
							spinnerPlacement='start'>
							Add {name.toLowerCase()}
						</Button>
					</DialogFooter>
				</form>
			</Dialog>
		</>
	);
};

export default QuickAdd;
