'use client';

import React from 'react';
import { Layout, useLazyGetByIdQuery, VInput, VSelect, Icon } from '@/components/library';
import { Button, Flex, FlexProps, useClipboard } from '@chakra-ui/react';

const DocPage = () => {
	const [path, setPath] = React.useState<string>('');
	const [id, setId] = React.useState<string>('keys');
	const [trigger, result] = useLazyGetByIdQuery();

	const { onCopy, value, setValue, hasCopied } = useClipboard(JSON.stringify(result?.data));

	const onApply = () => {
		trigger({ path: `model/${path}`, id: id });
	};
	return (
		<Layout
			pt='32px'
			title='Doc Page'
			path='doc'>
			<VInput
				value={path || ''}
				onChange={(e: any) => setPath(e.target.value)}
				label='Database Model Name'
			/>
			<VSelect
				value={id || ''}
				onChange={(e: any) => setId(e.target.value)}
				label='Options'>
				<option value='keys'>Keys</option>
				<option value='settings'>Settings</option>
				<option value='types'>Types</option>
			</VSelect>
			<Button
				onClick={onApply}
				isLoading={result?.isLoading}>
				Apply
			</Button>
			{result?.data && (
				<Flex {...codeBlock}>
					<Flex
						w='full'
						justify='flex-end'>
						<Button
							onClick={onCopy}
							size='xs'
							leftIcon={<Icon name='copy' />}
							colorScheme='gray'>
							{hasCopied ? 'Copied' : 'Copy'}
						</Button>
					</Flex>

					<pre style={{ color: 'whitesmoke' }}>{JSON.stringify(result?.data, null, 2)}</pre>
				</Flex>
			)}
			{result?.isError && (
				<Flex {...codeBlock}>
					<pre style={{ color: 'red' }}>{JSON.stringify(result?.error, null, 2)}</pre>
				</Flex>
			)}
		</Layout>
	);
};

const codeBlock: FlexProps = {
	flexDir: 'column',
	flex: 1,
	w: 'full',
	borderRadius: 4,
	my: 4,
	py: { base: 4, md: 6 },
	px: { base: 4, md: 8 },
	bg: 'background.dark',
};

export default DocPage;
