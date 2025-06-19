import { useMediaQuery } from '@chakra-ui/react';

const useIsMobile: any = () => {
	const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

	const isMobile = isLargerThan800 ? false : true;

	return isMobile;
};

export default useIsMobile;
