// Seed inicial de RevoLab: categorías de catálogo, departamentos, rangos,
// usuario admin + instructor, y el curso piloto "Growth Hacking Avanzado"
// completo (módulos, lecciones, quiz y examen) migrado desde los mocks
// de frontend/src/data para tener un caso end-to-end real desde el día uno.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { slug: 'analytics-seo', label: 'Analytics & SEO' },
  { slug: 'branding', label: 'Branding y Estrategia de Marca' },
  { slug: 'creatividad', label: 'Creatividad' },
  { slug: 'comercial', label: 'Comercial' },
  { slug: 'contenido', label: 'Contenido' },
  { slug: 'data-science', label: 'Data Science' },
  { slug: 'diseno', label: 'Diseño' },
  { slug: 'experiencia-digital', label: 'Experiencia Digital' },
  { slug: 'growth-hacking', label: 'Growth Hacking' },
  { slug: 'inbound-marketing', label: 'Inbound Marketing' },
  { slug: 'performance', label: 'Performance' },
  { slug: 'planificacion-financiera', label: 'Planificación Financiera' },
  { slug: 'transformacion', label: 'Transformación' },
];

const departments = [
  { slug: 'experiencia-digital', label: 'Experiencia Digital' },
  { slug: 'marketing', label: 'Marketing' },
  { slug: 'tecnologia', label: 'Tecnología' },
  { slug: 'recursos-humanos', label: 'Recursos Humanos' },
];

const ranks = [
  { key: 'cadete', title: 'Cadete Espacial', category: 'EXPLORACIÓN', order: 0 },
  { key: 'tripulante', title: 'Tripulante en Formación', category: 'EXPLORACIÓN', order: 1 },
  { key: 'especialista', title: 'Especialista de Misión', category: 'EXPANSIÓN', order: 2 },
  { key: 'piloto', title: 'Piloto de Sistemas', category: 'EXPANSIÓN', order: 3 },
  { key: 'comandante', title: 'Comandante de Misión', category: 'EXPANSIÓN', order: 4 },
  { key: 'arquitecta', title: 'Arquitecta Orbital', category: 'TRASCENDENCIA', order: 5 },
  { key: 'exploradora', title: 'Exploradora de Horizontes', category: 'TRASCENDENCIA', order: 6 },
];

const growthHackingQuestions = [
  {
    text: '¿Cuál es la principal diferencia entre Marketing Tradicional y Growth Hacking?',
    options: [
      { label: 'El presupuesto publicitario', isCorrect: false },
      { label: 'El enfoque en todo el embudo (AARRR)', isCorrect: true },
      { label: 'El uso de redes sociales', isCorrect: false },
      { label: 'Ninguna de las anteriores', isCorrect: false },
    ],
  },
  {
    text: '¿Qué significa la métrica de Retención en el modelo AARRR?',
    options: [
      { label: 'Cuántos usuarios nuevos llegan al producto', isCorrect: false },
      { label: 'Cuántos usuarios vuelven y permanecen activos', isCorrect: true },
      { label: 'Cuánto dinero genera cada cliente', isCorrect: false },
      { label: 'Cuántas veces se comparte el producto', isCorrect: false },
    ],
  },
  {
    text: '¿Cuál es el objetivo principal de un experimento en Growth Hacking?',
    options: [
      { label: 'Validar hipótesis con datos medibles', isCorrect: true },
      { label: 'Aumentar el presupuesto de marketing', isCorrect: false },
      { label: 'Crear más contenido en redes sociales', isCorrect: false },
      { label: 'Reducir el equipo de ventas', isCorrect: false },
    ],
  },
];

function withOrder(question, questionIndex) {
  return {
    text: question.text,
    order: questionIndex,
    options: {
      create: question.options.map((option, optionIndex) => ({
        label: option.label,
        isCorrect: option.isCorrect,
        order: optionIndex,
      })),
    },
  };
}

async function main() {
  const categoryRecords = {};
  for (const category of categories) {
    categoryRecords[category.slug] = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { label: category.label },
      create: category,
    });
  }

  const departmentRecords = {};
  for (const department of departments) {
    departmentRecords[department.slug] = await prisma.department.upsert({
      where: { slug: department.slug },
      update: { label: department.label },
      create: department,
    });
  }

  for (const rank of ranks) {
    await prisma.rank.upsert({
      where: { key: rank.key },
      update: rank,
      create: rank,
    });
  }
  const tripulanteRank = await prisma.rank.findUniqueOrThrow({ where: { key: 'tripulante' } });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@rompecabeza.cl' },
    update: {},
    create: {
      email: 'admin@rompecabeza.cl',
      nombre: 'Administrador RevoLab',
      role: 'ADMIN',
      departmentId: departmentRecords['tecnologia'].id,
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: 'ariel.jeria@rompecabeza.cl' },
    update: {},
    create: {
      email: 'ariel.jeria@rompecabeza.cl',
      nombre: 'Ariel Jeria',
      role: 'INSTRUCTOR',
      avatarUrl: '/images/home/instructor-ariel.webp',
      departmentId: departmentRecords['experiencia-digital'].id,
      rankId: tripulanteRank.id,
      careerIqNote: 'En progreso 75% hacia el próximo rango',
    },
  });

  const existingCourse = await prisma.course.findUnique({ where: { slug: 'growth-hacking' } });

  if (existingCourse) {
    console.log('Curso "growth-hacking" ya existe, se omite la creación del contenido.');
  } else {
    await prisma.course.create({
      data: {
        slug: 'growth-hacking',
        title: 'Growth Hacking Avanzado',
        description:
          'Aprende las estrategias que usan las startups para crecer exponencialmente.',
        about: [
          'Aprende las estrategias que usan las startups para crecer exponencialmente. En este curso profundizarás en metodologías probadas para adquirir y retener usuarios utilizando datos y experimentación continua.',
          'Ideal para perfiles de marketing, producto y fundadores que buscan escalar sus proyectos sin depender de grandes presupuestos publicitarios.',
        ],
        learningOutcomes: [
          'Crear embudos de conversión efectivos',
          'Optimizar la retención de usuarios (Cohort analysis)',
          'Diseñar y ejecutar experimentos A/B',
          'Automatizar procesos de marketing',
        ],
        tools: [
          { emoji: '🎨', name: 'Figma' },
          { emoji: '🤖', name: 'ChatGPT (IA)' },
          { emoji: '📊', name: 'Mixpanel' },
          { emoji: '📝', name: 'Notion' },
        ],
        coverImageUrl: '/images/home/course-growth-hacking.webp',
        level: 'Nivel Intermedio',
        durationLabel: '12h',
        videoHoursLabel: '3 horas de contenido en video',
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        enrollmentRequirement: 'NONE',
        autoCertificate: true,
        publishedAt: new Date(),
        categoryId: categoryRecords['growth-hacking'].id,
        departmentId: departmentRecords['experiencia-digital'].id,
        instructorId: instructor.id,
        modules: {
          create: [
            {
              title: 'Módulo 1',
              order: 0,
              lessons: {
                create: [
                  {
                    title: '¿Qué es el Growth Hacking?',
                    type: 'VIDEO',
                    order: 0,
                    durationSeconds: 630,
                    transcript: [
                      'Hola, bienvenidos a esta lección sobre Growth Hacking. El concepto de Growth Hacking no se trata solo de tácticas de marketing, sino de un enfoque sistemático para encontrar los canales más eficientes de crecimiento.',
                      'A diferencia del marketing tradicional, que a menudo se centra en el conocimiento de la marca (brand awareness), el Growth Hacking se centra en el crecimiento de todo el embudo, desde la adquisición hasta la retención y la recomendación.',
                    ],
                    quiz: {
                      create: {
                        kind: 'LESSON_QUIZ',
                        title: 'Quiz de Lección',
                        description:
                          'Responde las preguntas generadas por IA sobre la última lección para asegurar tu aprendizaje y continuar.',
                        passThreshold: 80,
                        questions: {
                          create: growthHackingQuestions.map(withOrder),
                        },
                      },
                    },
                  },
                  {
                    title: 'El mindset del Growth Hacker',
                    type: 'VIDEO',
                    order: 1,
                    durationSeconds: 630,
                    transcript: [
                      'Hola, bienvenidos a esta lección. En este módulo profundizarás en conceptos clave para aplicar lo aprendido de forma práctica en tu día a día profesional.',
                      'A diferencia de los enfoques tradicionales, aquí trabajaremos con metodologías basadas en datos, experimentación continua y mejora iterativa para lograr resultados medibles.',
                    ],
                  },
                  {
                    title: 'Métricas pirata (AARRR)',
                    type: 'VIDEO',
                    order: 2,
                    durationSeconds: 630,
                    transcript: [
                      'Hola, bienvenidos a esta lección. En este módulo profundizarás en conceptos clave para aplicar lo aprendido de forma práctica en tu día a día profesional.',
                      'A diferencia de los enfoques tradicionales, aquí trabajaremos con metodologías basadas en datos, experimentación continua y mejora iterativa para lograr resultados medibles.',
                    ],
                  },
                ],
              },
            },
          ],
        },
        finalExam: {
          create: {
            kind: 'FINAL_EXAM',
            title: 'Examen Final',
            description:
              'Pon a prueba todo lo aprendido. Necesitas un 80% para aprobar y obtener tu certificación.',
            passThreshold: 80,
            questions: {
              create: growthHackingQuestions.map(withOrder),
            },
          },
        },
      },
    });
  }

  console.log('Seed completado:', {
    admin: admin.email,
    instructor: instructor.email,
    categorias: categories.length,
    departamentos: departments.length,
    rangos: ranks.length,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
