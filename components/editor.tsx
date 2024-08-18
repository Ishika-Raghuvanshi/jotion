

"use client";
import React, { useEffect, useMemo, useState } from  "react";
import { useTheme } from "next-themes";
import { BlockNoteView } from"@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEdgeStore } from "@/lib/edgestore";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";

interface EditorComponentProps{
  onChange: (value:string) => void;
  initialContent?: string;
  editable?: boolean; 

}


const saveToLocalstorge = async (jsonBlocks : Block[]) => {
  localStorage.setItem('editorBlock',JSON.stringify(jsonBlocks))

 }

 const getDataFromLocalStorage = async () => {
  const getStorageData = localStorage.getItem('editorBlock');

  return getStorageData ? (JSON.parse(getStorageData)) as PartialBlock[] : undefined
 };

 

const EditorComponent = ({
  onChange,
  editable,
}:EditorComponentProps) => {
  const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined | 'loading' >('loading') 
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  

  useEffect(() => {
    getDataFromLocalStorage().then((content) => {
      setInitialContent(content)
    })
  }, []) ;

  const uploadFile = async (file:File) => {
    const body = new FormData();
    body.append("file", file);

    const res = await fetch("https://tmpfiles.org/api/v1/upload",{
      method: 'POST',
      body

    });
    return (await res.json()).data.url.replace(
      'tmpfiles.org/',
      'tmpfiles.org/dl/',


    )
  

  }

   
const editor = useMemo(() => {
  if(initialContent === 'loading'){
    return undefined
  }
  return BlockNoteEditor.create({
    initialContent,
    uploadFile,
  })
}, [initialContent])


  
if (editor === undefined) {
  return 'loading content'
}
  
  return (
    <div className=''>
    <BlockNoteView editor ={editor}
    onChange={() => saveToLocalstorge(editor?.document)}
    editable={true}
    theme={resolvedTheme === "dark" ? "dark" : "light"}
     />
    </div>
  )
}

export default EditorComponent