import prisma from '../lib/prisma';

import { Role } from '../../generated/prisma/enums';

const promoteUserRole = async (userId: string, role: Role): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
};

export default promoteUserRole;
