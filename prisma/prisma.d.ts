import { Prisma } from '@prisma/client';

// определяем какие вложенные объекты будем получать
const userIncludeRole = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    name: true,
    email: true,
    isActivated: true,
    userRole: { select: { name: true } },
  },
});

type UserForDTO = Prisma.UserGetPayload<typeof userForDTO>;

// определяем какие вложенные объекты будем получать
const markerIncludeDictionary = Prisma.validator<Prisma.MarkerArgs>()({
  include: {
    dictionary: true,
  },
});
// генерируем тип для Marker
type MarkersIncludeDictionary = Prisma.MarkerGetPayload<
  typeof markerIncludeDictionary
>;

const taskIncludeMarkersIncludeDictionary = Prisma.validator<Prisma.TaskArgs>()(
  {
    include: {
      markers: markerIncludeDictionary,
    },
  },
);
// генерируем тип для task
type TaskIncludeMarkersIncludeDictionary = Prisma.TaskGetPayload<
  typeof taskIncludeMarkersIncludeDictionary
>;

// type TaskWithMessages = Prisma.TaskGetPayload<{
//   include: {
//     markers: {
//       include: {
//         dictionary: true;
//       };
//     };
//   };
// }>;

export {
  userIncludeRole,
  UserIncludeRole,
  markerIncludeDictionary,
  MarkersIncludeDictionary,
  taskIncludeMarkersIncludeDictionary,
  TaskIncludeMarkersIncludeDictionary,
};
