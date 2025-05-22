import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
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

    if (!paramsData.colorId) {
      return new NextResponse('Id de la couleur requis', { status: 400 });
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

    const color = await prismadb.color.updateMany({
      where: {
        id: paramsData.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Non authentifié', { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse('Id de la boutique requis', { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse('Id de la couleur requis', { status: 400 });
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse('Id de la couleur requis', { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[COLOR_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
