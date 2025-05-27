"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { LoaderIcon } from 'lucide-react'
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";




function UploadPdfDialog({ children }) {
    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
    const InsertFileEntry = useMutation(api.fileStorage.AddFileEntryToDb);
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const OnFileSelect = (event) => {
        setFile(event.target.files[0]);
    }

    const OnUpload = async () => {
        setLoading(true);
        const postUrl = await generateUploadUrl();

        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file?.type },
            body: file,
        });
        const { storageId } = await result.json();
        console.log('StorageId', storageId);
        const fileId = 
        await sendImage({ storageId, author: name });

        setSelectedImage(null);
        imageInput.current.value = "";
        setLoading(false);

    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Pdf File</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <h2 className='mt-3'>Select a file to Upload</h2>
                            <div className='flex rounded-md border gap-2 p-3'>
                                <input type='file' accept='application/pdf' onChange={(event) => OnFileSelect(event)} />
                            </div>
                            <div className='mt-2'>
                                <label>File Name *</label>
                                <Input placeholder='filename' />
                            </div>

                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="submit">Close</Button>
                    </DialogClose>
                    <Button onClick={OnUpload}>
                        {loading ?
                            <LoaderIcon className='animate-spin' /> : 'Upload'
                        }</Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default UploadPdfDialog