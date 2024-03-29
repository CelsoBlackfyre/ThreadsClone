"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
}

export async function createThread({
	text,
	author,
	communityId,
	path,
}: Params) {
	try {
		connectToDB();

		const createThread = await Thread.create({
			text,
			author,
			community: null,
		});

		await User.findByIdAndUpdate(author, {
			$push: { threads: createThread._id },
		});

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to create thread: ${error.message}`);
	}
}

//Fetch the posts that have no paretns (top-level threads)
export async function fetchPosts(pageNumber = 1, pageSize = 20) {
	connectToDB();
	const skipAmount = (pageNumber - 1) * pageSize;

	const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
		.sort({
			createdAt: "desc",
		})
		.skip(skipAmount)
		.limit(pageSize)
		.populate({ path: "author", model: User })
		.populate({
			path: "children",
			populate: {
				path: "author",
				model: User,
				select: "_id id name parentId image",
			},
		});

	const totalPostCount = await Thread.countDocuments({
		parentId: { $in: [null, undefined] },
	});

	const posts = await postsQuery.exec();

	const isNext = totalPostCount > skipAmount + posts.length;

	return { posts, isNext };
}

export async function fetchThreadById(id: string) {
	connectToDB();
	try {
		const thread = await Thread.findById(id)
			.populate({
				path: "author",
				model: User,
				select: "_id id name image",
			})
			.populate({
				path: "children",
				populate: [
					{
						path: "author",
						model: User,
						select: "_id id name parentId image",
					},
					{
						path: "children",
						model: Thread,
						populate: {
							path: "author",
							model: User,
							select: "_id id name parentId image",
						},
					},
				],
			})
			.exec();
		return thread;
	} catch (error: any) {
		throw new Error(`Failed to fetch thread: ${error.message}`);
	}
}

export async function addCommentToThread(
	threadId: string,
	commentText: string,
	userId: string,
	path: string
) {
	connectToDB();
	try {
		const originalThread = await Thread.findById(threadId);

		if (!originalThread) {
			console.log(originalThread);
			throw new Error("Thread not found");
		}

		const user = await User.findById(userId);
		if (!user) {
			console.log(userId);
			throw new Error("User not found");
		}

		const commentThread = new Thread({
			text: commentText,
			author: userId,
			parentId: threadId,
		});

		if (!commentThread.author) {
			console.log(commentThread);
			throw new Error("Author not set for comment thread");
		}

		const saveCommentThread = await commentThread.save();

		originalThread.children.push(saveCommentThread._id);

		await originalThread.save();

		revalidatePath(path);
	} catch (error: any) {
		console.error(`Error adding comment to the thread: ${error.message}`);
		throw new Error(`Error adding comment to the thread: ${error.message}`);
	}
}
