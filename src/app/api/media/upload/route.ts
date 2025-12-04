import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import { MediaType } from '../../../../../generated/prisma';
import { corsHeaders } from '@/lib/cors';

const MAX_IMAGE_SIZE = 13 * 1024 * 1024; // 13 MB
const MAX_AUDIO_SIZE = 15 * 1024 * 1024; // 15 MB

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const imageFiles = formData.getAll('files') as File[];
    const audioFile = formData.get('audio') as File | null;
    const sosAlertId = formData.get('sosAlertId') as string;

    if (!sosAlertId)
      return NextResponse.json({ error: 'sosAlertId is required' }, { status: 400, headers: corsHeaders });
    if ((!imageFiles || imageFiles.length === 0) && !audioFile)
      return NextResponse.json({ error: 'No files provided' }, { status: 400, headers: corsHeaders });

    const results: any[] = [];
    const timestamp = new Date().toISOString(); // current timestamp

    // Upload images
    for (const file of imageFiles) {
      if (file.size > MAX_IMAGE_SIZE)
        return NextResponse.json(
          { error: `Image "${file.name}" exceeds max size of 13 MB` },
          { status: 400, headers: corsHeaders }
        );

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'Rakshak_uploads/images',
            context: `sosAlertId=${sosAlertId}|timestamp=${timestamp}`, // custom metadata
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });

      const media = await prisma.media.create({
        data: {
          sosAlertId,
          type: MediaType.photo,
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          format: uploadResult.format,
          width: uploadResult.width,
          height: uploadResult.height,
        },
      });

      results.push(media);
    }

    // Upload audio
    if (audioFile) {
      if (audioFile.size > MAX_AUDIO_SIZE)
        return NextResponse.json(
          { error: `Audio "${audioFile.name}" exceeds max size of 15 MB` },
          { status: 400, headers: corsHeaders }
        );

      const buffer = Buffer.from(await audioFile.arrayBuffer());

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video', // audio treated as video
            folder: 'Rakshak_uploads/audio',
            context: `sosAlertId=${sosAlertId}|timestamp=${timestamp}`,
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(buffer);
      });

      const media = await prisma.media.create({
        data: {
          sosAlertId,
          type: MediaType.audio,
          publicId: uploadResult.public_id,
          url: uploadResult.secure_url,
          format: uploadResult.format,
          duration: uploadResult.duration,
        },
      });

      results.push(media);
    }

    return NextResponse.json({ uploaded: results }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500, headers: corsHeaders });
  }
}

/*
when you fetch the media from Cloudinary, you can get metadata like:

uploadResult.context?.custom?.sosAlertId
uploadResult.context?.custom?.timestamp
 */