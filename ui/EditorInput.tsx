'use client';

import supabase from '#/lib/supabase-browser';
import { cn } from '#/lib/utils';
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBlockquote,
  IconBold,
  IconBrandYoutube,
  IconClearFormatting,
  IconCode,
  IconDirectionHorizontal,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconItalic,
  IconLink,
  IconLinkOff,
  IconList,
  IconListNumbers,
  IconPageBreak,
  IconPhoto,
  IconSection,
  IconSeparator,
  IconStrikethrough,
} from '@tabler/icons';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import type { Editor } from '@tiptap/react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { ReactNode } from 'react';

export default function EditorInput({
  postId,
  value,
  onChange,
}: {
  postId: number;
  value?: string;
  onChange: (value: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Dropcursor,
      Youtube.configure({
        modestBranding: true,
        width: 480,
        height: 270,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  return (
    <div>
      <MenuBar editor={editor} postId={postId} />
      <EditorContent
        editor={editor}
        className={cn(
          'post my-1 [&_div]:p-2 border border-gray-700 rounded-lg',
        )}
      />
    </div>
  );
}

const MenuBar = ({
  editor,
  postId,
}: {
  editor: Editor | null;
  postId: number;
}) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-1')}>
      <EditorButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
      >
        <IconBold />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
      >
        <IconItalic />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
      >
        <IconStrikethrough />
      </EditorButton>
      <EditorButton
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = prompt('Enter URL', previousUrl);

          if (url === null) {
            return;
          }

          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();

            return;
          }
          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url, target: '_blank' })
            .run();
        }}
        isActive={editor.isActive('link')}
      >
        <IconLink />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
      >
        <IconLinkOff />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
      >
        <IconDirectionHorizontal />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
      >
        <IconClearFormatting />
      </EditorButton>

      <EditorButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive('paragraph')}
      >
        <IconSection />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
      >
        <IconH2 />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
      >
        <IconH3 />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        isActive={editor.isActive('heading', { level: 4 })}
      >
        <IconH4 />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        isActive={editor.isActive('heading', { level: 5 })}
      >
        <IconH5 />
      </EditorButton>
      <label className={cn('p-1 rounded cursor-pointer')}>
        <input
          type="file"
          accept="image/*"
          onChange={async (event) => {
            if (!event.target.files?.length) {
              return;
            }
            const file = event.target.files[0];
            const { error } = await supabase.storage
              .from('posts')
              .upload(`post_${postId}/${file.name}`, file, {
                cacheControl: '3600',
                upsert: true,
              });
            console.log(file.name, error);
            if (error) {
              console.error(error);
              return;
            }

            const { data } = supabase.storage
              .from('posts')
              .getPublicUrl(`post_${postId}/${file.name}`);
            console.log(data);

            editor.chain().focus().setImage({ src: data.publicUrl }).run();
          }}
          className={cn('hidden')}
        />
        <IconPhoto />
      </label>
      <EditorButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
      >
        <IconList />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
      >
        <IconListNumbers />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
      >
        <IconCode />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
      >
        <IconBlockquote />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <IconSeparator />
      </EditorButton>
      <EditorButton onClick={() => editor.chain().focus().setHardBreak().run()}>
        <IconPageBreak />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <IconArrowBackUp />
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <IconArrowForwardUp />
      </EditorButton>
      <EditorButton
        onClick={() => {
          const url = prompt('Enter YouTube URL');

          if (url) {
            editor.commands.setYoutubeVideo({
              src: url,
              width: 480,
              height: 270,
            });
          }
        }}
      >
        <IconBrandYoutube />
      </EditorButton>
    </div>
  );
};

const EditorButton = ({
  isActive,
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: ReactNode;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn('p-1 rounded disabled:text-gray-500', {
        'bg-gray-800': isActive,
      })}
    >
      {children}
    </button>
  );
};
