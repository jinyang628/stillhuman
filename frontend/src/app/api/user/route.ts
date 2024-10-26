import { NextResponse } from 'next/server';

import { validate } from '@/actions/user/validate';

import { validateRequestSchema } from '@/types/actions/user/validate';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const parsedValidateRequest = validateRequestSchema.parse(params);
    const validateResponse = await validate(parsedValidateRequest);

    return NextResponse.json(validateResponse);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error validating Api Key. Please try again later.' },
      { status: 500 },
    );
  }
}
