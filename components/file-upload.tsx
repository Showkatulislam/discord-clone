"use client";
import {X} from 'lucide-react'
import Image from 'next/image';
import "@uploadthing/react/styles.css"
import { UploadDropzone } from "@/lib/uploadthing";

interface fileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

const Fileupload: React.FC<fileUploadProps> = ({
  endpoint,
  value,
  onChange,
}) => {
   const fileType=value.split('.').pop();

   if(value && fileType!=='pdf'){
    return (
      <div className='relative w-20 h-20'>
        <Image
        fill
        alt='upload'
        src={value}
        className="rounded-full"/>
        <button 
        onClick={()=>onChange("")}
        className='absolute top-0 right-0 rounded-full bg-rose-500 text-white shadow-lg'
        >
          <X className='w-4 h-4'/>
        </button>
      </div>
    )
   }
  
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};

export default Fileupload;
