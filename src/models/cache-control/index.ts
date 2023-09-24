import { InternalServerError } from 'errors';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';

function setCacheControl(res: NextApiResponse, cacheControl: string) {
  const cacheControlHeader = res.getHeaders()['cache-control'];

  if (
    typeof cacheControlHeader === 'string' &&
    cacheControlHeader?.toLowerCase() === cacheControl.toLowerCase()
  )
    return;

  res.setHeader('Cache-Control', cacheControl);

  const setHeader = res.setHeader;

  res.setHeader = (name, value) => {
    if (name.toLowerCase() === 'cache-control') {
      throw new InternalServerError({
        message: `Header Cache-Control já foi definido.`,
        errorLocationCode:
          'MODEL:CACHE_CONTROL:DIFFERENT_CACHE_CONTROL_ALREADY_DEFINED',
      });
    }
    return setHeader(name, value);
  };
}

function noCache(
  _: NextApiRequest | undefined,
  res: NextApiResponse,
  next?: () => void
) {
  setCacheControl(res, 'no-cache, no-store, max-age=0, must-revalidate');
  if (next) return next();
}

function swrMaxAge(maxAge = 10) {
  if (!Number.isInteger(maxAge))
    throw new TypeError('maxAge must be an integer.');

  return (_: NextRequest, res: NextApiResponse, next: () => void) => {
    setCacheControl(
      res,
      `public, s-maxage=${maxAge.toString()}, stale-while-revalidate`
    );
    if (next) next();
  };
}

export default Object.freeze({
  noCache,
  swrMaxAge,
});
