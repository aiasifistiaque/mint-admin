'use client';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { URL } from '../../../../lib/constants';
import 'react-quill/dist/quill.snow.css';
import { FormControl } from './input-components';

const QuillNoSSRWrapper = dynamic(
	async () => {
		const { default: RQ } = await import('react-quill');
		// eslint-disable-next-line react/display-name
		return ({ forwardedRef, ...props }: any) => (
			<RQ
				ref={forwardedRef}
				{...props}
			/>
		);
	},
	{
		ssr: false,
		loading: () => <p>Loading ...</p>,
	}
);

const QuillEditor = ({ value, onChange, name, isRequired, label, helper }: any) => {
	useEffect(() => {
		const ReactQuill = require('react-quill');
		const Quill = ReactQuill.Quill;
		const ImageResize = require('quill-image-resize-module-react').default;
		if (Quill && typeof window !== 'undefined') {
			Quill.register('modules/imageResize', ImageResize);
		}
	}, []);
	// useEffect(() => {
	// 	console.log('quill', value, name);
	// }, [value, name]);
	// console.log(name, value);

	const quillRef = useRef(null);

	const imageHandler = async () => {
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();

		input.onchange = async () => {
			const file = input.files ? input.files[0] : null;
			const quillObj: any = (quillRef as any)?.current?.getEditor();
			const range = quillObj?.getSelection();

			if (file) {
				const formData = new FormData();
				formData.append('image', file);
				try {
					const { data } = await axios.post(`${URL.backend}/api/upload`, formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					});

					if (data) {
						console.log(data);
						quillObj.editor.insertEmbed(range.index, 'image', data?.Location);
					}
				} catch (e) {
					console.log(e);
				}
			}
		};
	};

	const modules = useMemo(
		() => ({
			imageResize: {
				modules: ['Resize', 'DisplaySize'],
			},
			toolbar: {
				clipboard: {
					// toggle to add extra line breaks when pasting HTML:
					matchVisual: false,
				},
				container: [
					[{ header: [1, 2, 3, 4, 5, 6, false] }],
					['bold', 'italic', 'underline', 'strike'],
					[{ font: [] }],
					[{ align: [] }],
					[{ script: 'sub' }, { script: 'super' }],
					[{ color: [] }, { background: [] }], // dropdown with defaults from theme
					['blockquote', 'code-block'],

					['clean'],

					[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
					['image', 'link'],
				],
				handlers: {
					image: imageHandler,
				},
			},
		}),
		[]
	);

	return (
		<>
			<FormControl
				isRequired={isRequired}
				label={label}
				helper={helper}>
				<QuillNoSSRWrapper
					forwardedRef={quillRef}
					theme='snow'
					style={{
						backgroundColor: 'white',
						minHeight: '600px',
						height: '600px',
						marginBottom: '50px',
					}}
					modules={modules}
					value={value}
					onChange={(content: any, delta: any, source: any, editor: any) => {
						// Assuming you want to capture the HTML content and pass it along with a name
						const htmlContent = editor.getHTML(); // or editor.getText() for plain text
						// Construct an event-like object or directly use the content as needed
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
		</>
	);
};

export default QuillEditor;
