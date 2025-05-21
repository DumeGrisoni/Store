import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const paramsData = await params;
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

    if (!paramsData.storeId) {
      return new NextResponse('Id de la boutique requis', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: paramsData.storeId,
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

    const billboard = await prismadb.billBoard.create({
      data: {
        label,
        imageUrl,
        storeId: paramsData.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const paramsData = await params;

    if (!paramsData.storeId) {
      return new NextResponse('Id de la boutique requis', { status: 400 });
    }

    const billboards = await prismadb.billBoard.findMany({
      where: {
        storeId: paramsData.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log('[BILLBOARDS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
