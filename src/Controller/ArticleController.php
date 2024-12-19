<?php

namespace App\Controller;

use App\Entity\Article;
use App\Repository\ArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ArticleController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }


    #[Route('/articles', name: 'app_article')]
    public function index(): Response
    {
        $html = file_get_contents('/home/sms_12/gestion_dette_projet_microservice/Views/Article/index.html');
        return new Response($html);
    }

    #[Route('api/articles', name: 'api_Article', methods: ['GET'])]
    public function getArticles(Request $request, ArticleRepository $articleRepository): JsonResponse
    {
        $limit = 5;

        $page = (int) $request->query->get('page', 1);

        $offset = ($page - 1) * $limit;

        $articles = $articleRepository->findBy([], null, $limit, $offset);

        $totalArticles = $articleRepository->count([]);
        $totalPages = (int) ceil($totalArticles / $limit);

        $data = array_map(function (Article $article) {
            return [
                'id' => $article->getId(),
                'libelle' => $article->getLibelle(),
                'qteStock' => $article->getQteStock(),
                'prix' => $article->getPrix(),
                'ref' => $article->getRef(),
                'createdAt' => $article->getCreatedAt()->format('Y-m-d H:i:s'),
                'updatedAt' => $article->getUpdatedAt()->format('Y-m-d H:i:s')
            ];
        }, $articles);

        return new JsonResponse([
            'data' => $data,
            'totalPages' => $totalPages,
            'currentPage' => $page,
        ], Response::HTTP_OK);
    }


    #[Route('/articles/form', name: 'add_article')]
    public function form(): Response
    {
        $html = file_get_contents('/home/sms_12/gestion_dette_projet_microservice/Views/Article/fom.html');
        return new Response($html);
    }

    #[Route('api/articles/store', name: 'create_article', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation des données (vous pouvez utiliser des formulaires ou des contraintes Symfony pour mieux gérer cela)
        if (!isset($data['libelle'], $data['qteStock'], $data['prix'])) {
            return new JsonResponse(['error' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }

        $article = new Article();
        $article->setLibelle($data['libelle'])
            ->setQteStock($data['qteStock'])
            ->setPrix($data['prix']);

        $this->entityManager->persist($article);
        $this->entityManager->flush();

        return new JsonResponse(
            [
                'message' => 'Article created successfully',
                'id' => $article->getId()
            ],
            Response::HTTP_CREATED
        );
    }
}