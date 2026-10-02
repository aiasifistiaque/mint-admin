'use client';

import UserGuide from '../_components/UserGuide';
import { C, List, P, Section, Terms } from '../../docs/_components/prose';

/**
 * The dashboard builder for projects. Section ids mirror the platform's guide
 * (layout, widgets, numbers, charts, recent, filters, access, preview,
 * saving) — the builder's links land here through panel.ts docsPath.
 */

const SECTIONS = [
	{ id: 'what', title: 'What it is' },
	{ id: 'layout', title: 'Arranging' },
	{ id: 'widgets', title: 'Widgets' },
	{ id: 'numbers', title: 'Numbers' },
	{ id: 'charts', title: 'Charts' },
	{ id: 'recent', title: 'Recent items' },
	{ id: 'filters', title: 'Conditions' },
	{ id: 'access', title: 'Who sees what' },
	{ id: 'preview', title: 'The preview' },
	{ id: 'saving', title: 'Saving and resetting' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const Dashboard = () => (
	<UserGuide
		href='/user-docs/dashboard'
		sections={SECTIONS}
		open={{ href: '/dashboard-builder', label: 'Open Dashboard' }}>
		<Section
			id='what'
			title='What it is'
			lead='Build → Dashboard chooses what your project’s home page shows.'>
			<P>
				Numbers, charts and short lists of recent records, from any of your models — this month’s bookings, revenue by month,
				orders by status, the latest sign-ups. It shows live numbers as you build. A new project’s home is empty until you
				save a dashboard here. Each project has its own.
			</P>
		</Section>

		<Section
			id='layout'
			title='Arranging'
			lead='Widgets fill rows left to right, in order.'>
			<List
				items={[
					<>
						<strong>Add</strong>: <em>Add number</em>, <em>Add chart</em> or <em>Add recent items</em> at the top.
					</>,
					<>
						<strong>Move</strong>: drag a widget onto another’s place.
					</>,
					<>
						<strong>Edit</strong>, <strong>duplicate</strong> or <strong>remove</strong> with the buttons in its corner.
					</>,
					<>
						<strong>Size</strong>: a quarter, a third, half, two thirds or the full width. Tablets give small widgets half the
						width; on phones every widget is full width.
					</>,
				]}
			/>
		</Section>

		<Section
			id='widgets'
			title='Widgets'
			lead='Every widget reads one model.'>
			<Terms
				rows={[
					['What it shows', 'Number, Chart or Recent items. Switching keeps the model, title and conditions.'],
					['Model', 'Where its records come from.'],
					['Title', 'Its heading — or one made up from what it shows, like “Total amount · Invoices”.'],
					['Size', 'Its share of the width.'],
				]}
			/>
		</Section>

		<Section
			id='numbers'
			title='Numbers'
			lead='One figure: how many records, or the total or average of a number field.'>
			<Terms
				rows={[
					['Measure', 'Count, total (revenue, quantity) or average.'],
					['Time range', 'Today, the last 7, 30 or 90 days, this month, the last 12 months, this year, or all time.'],
					['Dated by', 'Which date the range uses — when the record was created, or another date field.'],
					['Prefix / Suffix', <>Text around the number — <C>$</C> before a total, <C>kg</C> after a weight.</>],
					['Compare with the period before', '“12% up on the period before”.'],
				]}
			/>
		</Section>

		<Section
			id='charts'
			title='Charts'
			lead='The same measures, over time or broken down by a field.'>
			<Terms
				rows={[
					['Over time', 'One column or point per day, week or month — bookings a day, revenue a month.'],
					['Broken down by a field', 'One slice or bar per value — orders by status, invoices by client.'],
					['Show the top', 'How many values get their own slice; the rest add up as “Other”.'],
					['Drawn as', 'Columns or a line over time; a donut or bars for a breakdown.'],
				]}
			/>
			<P>Hover a column, point or slice for its exact value.</P>
		</Section>

		<Section
			id='recent'
			title='Recent items'
			lead='A short table of records.'>
			<P>
				Up to six columns, 3 to 20 rows, newest or oldest first — or highest first by a number or date (the biggest orders,
				the nearest due dates). The first column links to the record.
			</P>
		</Section>

		<Section
			id='filters'
			title='Conditions'
			lead='Count or list only some records.'>
			<P>
				Conditions on the model’s fields — <em>is</em>, <em>is not</em>, <em>is one of</em>: confirmed bookings only, paid
				invoices. A record counts when every condition holds.
			</P>
		</Section>

		<Section
			id='access'
			title='Who sees what'
			lead='A widget never shows anyone more than they could open themselves.'>
			<P>
				Everyone sees the same dashboard, but each widget fetches its numbers with the viewer’s own permissions. Someone whose
				role can’t see a model doesn’t see its widgets. Changing the dashboard needs the <em>Build</em> permission.
			</P>
		</Section>

		<Section
			id='preview'
			title='The preview'>
			<P>
				The widget dialog shows the widget with real numbers as you set it up, so you can try a measure or chart type before
				adding it.
			</P>
		</Section>

		<Section
			id='saving'
			title='Saving and resetting'>
			<P>
				Nothing changes until you press <strong>Save changes</strong> in the bar at the bottom; saving updates the home page
				for everyone at once. <strong>Discard</strong> drops unsaved changes. Leaving with unsaved changes asks first.
			</P>
		</Section>

		<Section
			id='faq'
			title='Troubleshooting'>
			<Terms
				head={['Symptom', 'Why, and what to do']}
				rows={[
					['A teammate doesn’t see a widget', 'Their role can’t see that model.'],
					['“Isn’t a number field”', 'Totals and averages need a number field.'],
					['“More than 400 days”', 'Too many days for a chart by day — pick a shorter range, or weeks or months.'],
					['I can’t save', 'Your role needs the Build permission.'],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Dashboard;
