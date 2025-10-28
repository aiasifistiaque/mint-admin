'use client';

import { Dialog, Button, useDisclosure, Grid } from '@chakra-ui/react';
import React from 'react';

import { useUpdateByIdMutation } from '@/components/library/store/services/commonApi';
import CustomMenuItem from '@/components/library/menu/CustomMenuItem';
import { ViewOnly, useCustomToast } from '@/components/library';

type DeleteItemModalProps = {
	title?: string;
	id: string;
	path: string;
	data: any;
};

const ApproveLeaveModal: React.FC<DeleteItemModalProps> = ({ data, title, path, id }) => {
	const { open: isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef<any>();

	const [trigger, result] = useUpdateByIdMutation();

	const close = () => {
		result?.reset();
		onClose();
	};

	const handleApprove = (e: any) => {
		e.preventDefault();
		trigger({
			path: 'leave',
			id: id,
			body: {
				status: 'approved',
			},
		});
	};

	const handleReject = (e: any) => {
		e.preventDefault();
		trigger({
			path: 'leave',
			id: id,
			body: {
				status: 'rejected',
			},
		});
	};

	useCustomToast({
		successText: `${title ? title : 'Item'} Updated Successfully`,
		isSuccess: result?.isSuccess,
		isError: result?.isError,
		isLoading: result?.isLoading,
		error: result?.error,
	});

	return (
		<>
			<CustomMenuItem onClick={onOpen}>Action</CustomMenuItem>

			<Dialog.Root
				size='xl'
				open={isOpen}
				onOpenChange={e => !e.open && close()}
				role='alertdialog'>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content
						boxShadow='lg'
						borderRadius='xl'
						bg='menu.light'
						_dark={{
							bg: 'menu.dark',
						}}>
						<Dialog.Header
							fontSize='lg'
							fontWeight='bold'>
							<Dialog.Title>Leave Approval</Dialog.Title>
						</Dialog.Header>

						<Dialog.Body>
							<Grid
								mb={4}
								gridTemplateColumns='1fr 1fr'
								rowGap={4}>
								<ViewOnly
									label='Employee'
									value={data?.employee?.name}
								/>
								<ViewOnly
									label='Email'
									value={data?.employee?.email}
								/>
								<ViewOnly
									label='Leave Type'
									value={data?.leaveType}
								/>
								<ViewOnly
									label='Days'
									value={data?.days}
								/>
								<ViewOnly
									label='Start Date'
									value={new Date(data?.startDate).toLocaleDateString()}
								/>
								<ViewOnly
									label='End Date'
									value={new Date(data?.endDate).toLocaleDateString()}
								/>

								<ViewOnly
									label='Status'
									value={data?.status}
								/>
							</Grid>
							<ViewOnly
								label='Reason'
								value={data?.reason}
							/>
						</Dialog.Body>

						<Dialog.Footer>
							{data?.status == 'pending' ? (
								<>
									<Button
										size='sm'
										loading={result?.isLoading}
										onClick={handleReject}
										colorPalette='red'>
										Reject
									</Button>

									<Button
										loading={result?.isLoading}
										onClick={handleApprove}
										ml={2}
										size='sm'>
										Approve
									</Button>
								</>
							) : (
								<Button
									onClick={onClose}
									ml={2}
									size='sm'>
									Close
								</Button>
							)}
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Dialog.Root>
		</>
	);
};

export default ApproveLeaveModal;
