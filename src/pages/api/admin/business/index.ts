import {
  EnsureAuthenticatedRequest,
  ensureAuthenticatedWithRole,
} from '@server/middlewares/ensureAuthenticated';
import { NextApiResponse } from 'next';
import { prisma } from '@server/db';
import { format } from 'date-fns';

interface GetBusinessInfoRequest extends EnsureAuthenticatedRequest {
  query: {
    from: string;
    to: string;
  };
}

const getBusinessInfo = async (
  req: GetBusinessInfoRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { from, to } = req.query;

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
    },
  });

  const newUsersPerDayRaw: {
    date: string;
    usuários: number;
  }[] = users.reduce((acc, user) => {
    const date = user.createdAt.toISOString();

    if (!date) {
      return acc;
    }

    const dateInArray = acc.find((item) => item.date === date);

    if (!dateInArray) {
      acc.push({ date, usuários: 1 });
    } else {
      dateInArray['usuários'] += 1;
    }

    return acc;
  }, [] as { date: string; usuários: number }[]);

  newUsersPerDayRaw.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    }

    if (a.date > b.date) {
      return 1;
    }

    return 0;
  });

  const newUsersPerDay = newUsersPerDayRaw.map((item) => {
    return {
      date: format(new Date(item.date), 'dd/MM/yyyy'),
      usuários: item['usuários'],
    };
  });

  return res.status(200).json({ newUsersPerDay, totalUsers: users.length });
};

export default ensureAuthenticatedWithRole(getBusinessInfo, ['ADMIN']);