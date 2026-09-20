'use client';
import { ServerPage } from '@/components/library';
import DownloadInvoicePdfMenuItem from '@/components/library/invoice/DownloadInvoicePdfMenuItem';

const extraMenu = [{ type: 'custom', title: 'Download PDF', modal: DownloadInvoicePdfMenuItem }];

const InvoicesPage = () => {
	return (
		<ServerPage
			route='invoices'
			extraMenu={extraMenu}
		/>
	);
};

export default InvoicesPage;
