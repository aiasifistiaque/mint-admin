'use client';
import React, { useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FormControl } from '../input-components';
import ImageUploader from '../../../modals/upload-modal/ImageUploader';
import { useDisclosure } from '@chakra-ui/react';
import './style.css';

const QuillNoSSRWrapper = dynamic(
	async () => {
		const { default: RQ } = await import('react-quill-new');
		// Assign a display name to the component
		const Component = ({ forwardedRef, ...props }: any) => (
			<RQ
				ref={forwardedRef}
				{...props}
			/>
		);
		Component.displayName = 'QuillNoSSRWrapper';
		return Component;
	},
	{
		ssr: false,
		loading: () => <p>Loading ...</p>,
	}
);

const FullEditor = ({ value, onChange, name, isRequired, label, helper }: any) => {
	// Register quill-resize-image module for React 19 compatibility
	useEffect(() => {
		const registerImageResize = async () => {
			if (typeof window !== 'undefined') {
				try {
					const ReactQuill = (await import('react-quill-new')).default;
					const Quill = ReactQuill.Quill;
					const ImageResize = (await import('quill-resize-image')).default;

					if (Quill) {
						Quill.register('modules/resize', ImageResize);
					}
				} catch (error) {
					console.warn('Failed to register image resize module:', error);
				}
			}
		};

		registerImageResize();
	}, []);

	const quillRef = useRef(null);
	const { onOpen, isOpen, onClose } = useDisclosure();

	const handleImage = (image: string) => {
		const quillObj: any = (quillRef as any)?.current?.getEditor();
		if (!quillObj) console.log('Quill Object Not Found');
		const range = quillObj.getSelection() || { index: 0 };
		quillObj.insertEmbed(range.index, 'image', image);
		quillObj.setSelection(range.index + 1);
	};

	const modules = useMemo(
		() => ({
			resize: {
				locale: {},
			},
			toolbar: {
				clipboard: {
					// toggle to add extra line breaks when pasting HTML:
					matchVisual: false,
				},
				container: [
					[{ header: [1, 2, 3, 4, 5, 6, false] }],
					['bold', 'italic', 'underline', 'strike'],
					// [{ font: [] }],
					[{ align: [] }],
					// [{ script: 'sub' }, { script: 'super' }],
					// [{ color: [] }, { background: [] }], // dropdown with defaults from theme
					['blockquote', 'code-block'],
					// ['clean'],
					[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
					['image', 'link'],
				],
				handlers: {
					image: onOpen,
				},
			},
		}),
		[onOpen]
	);

	return (
		<div className='full-editor-quill'>
			<FormControl
				isRequired={isRequired}
				label={label}
				helper={helper}>
				<ImageUploader
					handleImage={handleImage}
					isOpen={isOpen}
					onClose={onClose}
					onOpen={onOpen}
				/>
				<QuillNoSSRWrapper
					forwardedRef={quillRef}
					theme='snow'
					className='custom-quill-editor'
					style={{
						overflow: 'hidden',
						maxW: '50vw',
						marginBottom: '20px',
					}}
					modules={modules}
					formats={formats}
					value={value}
					onChange={(content: any, delta: any, source: any, editor: any) => {
						const htmlContent = editor.getHTML();
						const customEvent = {
							target: {
								name: name,
								value: htmlContent,
							},
						};
						onChange(customEvent);
					}}
				/>
			</FormControl>
		</div>
	);
};

const formats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'align',
	'script',
	'color',
	'background',
	'blockquote',
	'code-block',
	'clean',
	'list',
	'bullet',
	'indent',
	'image',
	'link',
];

export default FullEditor;
