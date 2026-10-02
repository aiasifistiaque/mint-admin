'use client';

import { Component, ReactNode } from 'react';
import { Box, Text } from '@chakra-ui/react';

/**
 * Keeps one broken example from taking the whole library page down: the
 * library renders dozens of live components with sample values, and a few
 * (internal inputs, especially) expect context a docs page doesn't have.
 * Shows what failed instead, which is itself worth knowing.
 */
export default class SafeDemo extends Component<{ children: ReactNode; name?: string }, { error: Error | null }> {
	state = { error: null as Error | null };

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	render() {
		if (!this.state.error) return this.props.children;
		return (
			<Box
				p={3}
				borderWidth='1px'
				borderStyle='dashed'
				borderColor='border'
				borderRadius='md'>
				<Text
					fontSize='12px'
					color='fg.muted'>
					{this.props.name ? `${this.props.name} ` : ''}can’t render outside a real form here:{' '}
					{this.state.error.message}
				</Text>
			</Box>
		);
	}
}
