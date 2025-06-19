import { useEffect, useState } from 'react';
import {
	Flex,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
} from '@chakra-ui/react';
import ModalContainer from '../../menu/ModalContainer';

import { useCustomToast, ModalFormSection, VInput, useUpdatePasswordMutation } from '../..';

const UpdatePasswordModal = ({ trigger, path }: { trigger?: any; path?: any }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [formData, setFormData] = useState<any>({
		oldPassword: '',
		password: '',
		confirm: '',
	});

	const [register, result] = useUpdatePasswordMutation();

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		register(formData);
	};

	const onModalClose = () => {
		setFormData({});
		result.reset();
		onClose();
	};

	useCustomToast({
		isLoading: result.isLoading,
		isError: result.isError,
		error: result.error,
		isSuccess: result.isSuccess,
		successText: 'Password Updated Successfully',
	});

	useEffect(() => {
		if (result.isSuccess && !result.isLoading) {
			onModalClose();
		}
	}, [result]);

	return (
		<>
			<Flex onClick={onOpen}>{trigger || path}</Flex>
			<Modal
				size='2xl'
				isOpen={isOpen}
				onClose={onModalClose}
				closeOnOverlayClick={false}>
				<ModalOverlay />
				<ModalContainer>
					<ModalHeader>Update Password</ModalHeader>
					<ModalCloseButton />
					<form onSubmit={handleSubmit}>
						<ModalBody>
							<ModalFormSection>
								<VInput
									label='Old Password'
									name='oldPassword'
									value={formData.oldPassword}
									onChange={handleChange}
									type='password'
									isRequired
								/>
								<VInput
									label='Password'
									name='password'
									value={formData.password}
									onChange={handleChange}
									type='password'
									isRequired
								/>
								<VInput
									label='Confirm Password'
									name='confirm'
									value={formData.confirm}
									onChange={handleChange}
									type='password'
									isRequired
								/>
							</ModalFormSection>
						</ModalBody>
						<ModalFooter py={4}>
							<Button
								mr={2}
								size='sm'
								variant='white'
								onClick={onModalClose}>
								Discard
							</Button>
							<Button
								size='sm'
								type='submit'
								isLoading={result.isLoading}>
								Update
							</Button>
						</ModalFooter>
					</form>
				</ModalContainer>
			</Modal>
		</>
	);
};

export default UpdatePasswordModal;
