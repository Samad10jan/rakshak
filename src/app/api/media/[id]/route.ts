// src/app/api/media/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { corsHeaders } from '@/lib/cors';

export async function OPTIONS() {
    // Handle preflight requests (CORS)
    return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string; }> }) {
    try {
        const param = await params;
        const sosAlertId = param.id;

        if (!sosAlertId) {
            return NextResponse.json(
                { error: 'SOSAlert ID required' },
                { status: 400, headers: corsHeaders }
            );
        }

        // Fetch media linked to the SOSAlert
        const media = await prisma.media.findMany({
            where: { sosAlertId },
            orderBy: { uploadedAt: 'desc' },
            select: {
                id: true,
                sosAlertId: true,
                type: true,
                publicId: true,
                url: true,
                format: true,
                width: true,
                height: true,
                duration: true,
                uploadedAt: true,
            },
        });

        return NextResponse.json({ media });
    } catch (error: any) {
        const message = error.message || 'Failed to fetch media';
        return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders });
    }
}
