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
    const { name, value } = body;

    if (!name) {
      return new NextResponse('Nom requis', { status: 400 });
    }

    if (!value) {
      return new NextResponse('Valeur est requise', { status: 400 });
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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: paramsData.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLORS_POST]', error);
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

    const colors = await prismadb.color.findMany({
      where: {
        storeId: paramsData.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log('[COLORS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
