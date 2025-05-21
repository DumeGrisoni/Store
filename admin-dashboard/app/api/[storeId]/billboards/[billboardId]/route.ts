import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Non authentifié', { status: 401 });
    }

    const body = await req.json();
    const { label, imageUrl } = body;

    if (!label) {
      return new NextResponse('Titre requis', { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("L'image est requise", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Id de la boutique requis', { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse('Id du panneau requis', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse(
        'Non autorisé pour cette boutique avec ce compte',
        {
          status: 403,
        }
      );
    }

    const billboard = await prismadb.billBoard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Non authentifié', { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse('Id de la boutique requis', { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse('Id du panneau requis', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse(
        'Non autorisé pour cette boutique avec ce compte',
        {
          status: 403,
        }
      );
    }

    const billboard = await prismadb.billBoard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse('Id du panneau requis', { status: 400 });
    }

    const billboard = await prismadb.billBoard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
