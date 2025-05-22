import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
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

    if (!paramsData.sizeId) {
      return new NextResponse('Id de la taille requis', { status: 400 });
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

    const size = await prismadb.size.updateMany({
      where: {
        id: paramsData.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[SIZE_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Non authentifié', { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse('Id de la boutique requis', { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse('Id de la taille requis', { status: 400 });
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[SIZE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse('Id de la taille requis', { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[SIZE_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
