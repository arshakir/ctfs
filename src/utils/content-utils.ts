import { getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

export async function getSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}

export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.map((post: { data: { tags: string[] } }) => {
		post.data.tags.map((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	type CategoryMeta = {
		count: number;
		latestDate: Date;
	};

	const metaMap: { [key: string]: CategoryMeta } = {};

	for (const post of allBlogPosts) {
		const { category, published} = post.data;
		const date = new Date(published);

		const key = category
			? String(category).trim()
			: i18n(I18nKey.uncategorized);

		if (!metaMap[key]) {
			metaMap[key] = {
				count: 1,
				latestDate: date,
			};
		} else {
			metaMap[key].count += 1;
			if (date < metaMap[key].latestDate) {
				metaMap[key].latestDate = date;
			}
		}
	}

	const ret: Category[] = Object.entries(metaMap)
		.sort(([, a], [, b]) => b.latestDate.getTime() - a.latestDate.getTime())
		.map(([name, meta]) => ({
			name,
			count: meta.count,
			url: getCategoryUrl(name),
		}));

	return ret;
}
