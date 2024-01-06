"use client";
import { useForm, useFormContext } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import * as z from "zod";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import "@/app/globals.css"; // c:/Users/celso/Documents/ZeroToFullStack/threadsclone/app globals.css";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing, uploadFiles } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";

/*interface Props {
	user: {
		id: string;
		objectID: string;
		username: string;
		name: string;
		bio: string;
		image: string;
	};
	btnTitle: string;
}*/

interface Props {
	userId: string;
}

/*function PostThread({ userId }: { userId: string }) {
	const router = useRouter();
	const pathname = usePathname();*/

function PostThread({ userId }: Props) {
	const router = useRouter();
	const pathname = usePathname();

	const form = useForm<z.infer<typeof UserValidation>>({
		resolver: zodResolver(ThreadValidation),
		defaultValues: {
			thread: "",
			accountId: userId,
		},
	});

	const onSubmit = async (values: z.infer<typeof UserValidation>) => {
		await createThread({
			text: values.thread,
			author: userId,
			communityId: null,
			path: pathname,
		});

		router.push("/");
	};

	return (
		<Form {...form}>
			<form
				className="mt-10 flex flex-col justify-start gap-10"
				onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="thread"
					render={({ field }) => (
						<FormItem className="flex flex-col w-full gap-3">
							<FormLabel className="text-base-semibold text-light-2">
								Content
							</FormLabel>
							<FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
								<Textarea rows={15} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="w-full flex flex-col justify-center mt-10 bg-red-900 text-light-1 ">
					Post Thread
				</Button>
			</form>
		</Form>
	);
}

export default PostThread;
