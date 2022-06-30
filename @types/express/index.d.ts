// import { User } from '../../db/models'
// import UserDto from '../../dtos/userDto'

import { UserIncludeRole } from '../../prisma/prismaClient';

// declare global {
//   namespace Express {
//     interface Request {
//       user: User
//       files?: Array<File>
//     }
//   }
// }

// declare module 'express-serve-static-core' {
//   interface Request {
//     user: User
//     files?: Array<File>
//   }
// }

declare module 'express' {
  interface Request {
    user: UserIncludeRole;
    // files?: { img: File };
  }
}
