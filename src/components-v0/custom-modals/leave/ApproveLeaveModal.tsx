'use client';

import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
	useDisclosure,
	Grid,
} from '@chakra-ui/react';
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
	const { isOpen, onOpen, onClose } = useDisclosure();
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

			<AlertDialog
				size='2xl'
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={close}>
				<AlertDialogOverlay>
					<AlertDialogContent
						boxShadow='lg'
						borderRadius='xl'
						bg='menu.light'
						_dark={{
							bg: 'menu.dark',
						}}>
						<AlertDialogHeader
							fontSize='lg'
							fontWeight='bold'>
							Leave Approval
						</AlertDialogHeader>

						<AlertDialogBody>
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
						</AlertDialogBody>

						<AlertDialogFooter>
							{data?.status == 'pending' ? (
								<>
									<Button
										size='sm'
										isLoading={result?.isLoading}
										onClick={handleReject}
										colorScheme='red'>
										Reject
									</Button>

									<Button
										isLoading={result?.isLoading}
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
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default ApproveLeaveModal;
