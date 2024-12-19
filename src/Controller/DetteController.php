<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Client;
use App\Entity\Dette;
use App\Entity\Detail;
use App\Enum\Etat;
use App\Repository\ArticleRepository;
use App\Repository\ClientRepository;
use App\Repository\DetteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Attribute\Route;

class DetteController extends AbstractController
{
    #[Route('/dettes', name: 'app_dette')]
    public function index(): Response
    {
        $html = file_get_contents("/home/sms_12/gestion_dette_projet_microservice/Views/Dette/index.html");
        return new Response($html);
    }

    #[Route('/dettes/form', name: 'get_dette', methods: ['GET'])]
    public function getForm(): Response
    {
        $html = file_get_contents("/home/sms_12/gestion_dette_projet_microservice/Views/Dette/form.html");
        return new Response($html);
    }

    #[Route('/dettes/id={id}', name: 'detail_dette')]
    public function detailDette(): Response
    {
        $html = file_get_contents("/home/sms_12/gestion_dette_projet_microservice/Views/Dette/detail.html");
        return new Response($html);
    }

    #[Route('api/allArticle', name: 'api_all_articles', methods: ['GET'])]
    public function getArticleAll(ArticleRepository $articleRepository): JsonResponse
    {
        $articles = $articleRepository->findAll();

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

        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route('api/allClient', name: 'api_all_clients', methods: ['GET'])]
    public function getClientsAll(ClientRepository $clientRepository): JsonResponse
    {
        $clients = $clientRepository->findAll();

        $data = array_map(function (Client $client) {
            return [
                'id' => $client->getId(),
                'surnom' => $client->getSurnom(),
                'telephone' => $client->getTelephone(),
                'adresse' => $client->getAdresse(),
                'nom' => $client->getUsers()?->getNom(),
                'prenom' => $client->getUsers()?->getPrenom(),
                'login' => $client->getUsers()?->getLogin(),
                'role' => $client->getUsers()?->getRoles()[0] ?? null,
                'image' => $client->getUsers()?->getImage() ?? null,
            ];
        }, $clients);

        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route('api/dettes/id={id}', name: 'dette_detail')]
    public function getDetailDette(DetteRepository $detteRepository, $id): JsonResponse
    {
        $dette = $detteRepository->find($id);

        $data = [
            'id' => $dette->getId(),
            'montant' => $dette->getMontant(),
            'montantVerser' => $dette->getMontantVerser(),
            'date' => $dette->getDate()->format('Y-m-d'),
            'etat' => $dette->getEtat(),
            'surnom' => $dette->getClient()->getSurnom(),
            'adresse' => $dette->getClient()->getAdresse(),
        ];

        return new JsonResponse(
            $data,
            Response::HTTP_OK
        );
    }


    #[Route('/api/panier', name: 'api_panier', methods: ['GET'])]
    public function listPanier(SessionInterface $session): JsonResponse
    {
        $panier = $session->get('panier', []);
        $data = [];
        foreach ($panier as $item) {
            $data[] = [
                'idArticle' => $item['idArticle'],
                'libelle' => $item['libelle'],
                'prix' => $item['prix'],
                'quantite' => $item['quantite'],
                'total' => $item['total'],
            ];
        }
        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route('/api/dettes/addArticle', name: 'add_article', methods: ['POST'])]
    public function addArticle(Request $request, SessionInterface $session, ArticleRepository $articleRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $panier = $session->get('panier', []);


        $articleId = $data['article'];
        $article = $articleRepository->find($articleId);


        if ($article) {
            $found = false;
            foreach ($panier as &$item) {
                if ($item['idArticle'] === $article->getId()) {
                    $item['quantite'] += $data['quantite'];
                    $item['total'] = (float)($item['prix'] * $item['quantite']);
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                $panier[] = [
                    'libelle' => $article->getLibelle(),
                    'quantite' => $data['quantite'],
                    'prix' => $article->getPrix(),
                    'total' => (float)($article->getPrix() * $data['quantite']),
                    'idArticle' => $article->getId(),
                ];
            }

            $session->set('panier', $panier);
        }

        if (empty($panier)) {
            return new JsonResponse(['message' => 'Le panier est vide'], Response::HTTP_OK);
        }


        return new JsonResponse(
            [
                'message' => 'User created successfully',
            ],
            Response::HTTP_CREATED
        );
    }

    #[Route('api/dettes', name: 'api_dettes', methods: ['GET'])]
    public function listDette(Request $request, DetteRepository $detteRepository): JsonResponse
    {

        $limit = 5;
        $page = (int) $request->query->get('page', 1);
        $offset = ($page - 1) * $limit;
        $totalDette = $detteRepository->count([]);
        $totalPages = (int) ceil($totalDette / $limit);

        $dettes = $detteRepository->findBy([], null, $limit, $offset);

        $data = array_map(function ($dette) {
            return [
                'id' => $dette->getId(),
                'montant' => $dette->getMontant(),
                'montantVerser' => $dette->getMontantVerser(),
                'date' => $dette->getDate()->format('Y-m-d'),
                'etat' => $dette->getEtat(),
                'surnom' => $dette->getClient()->getSurnom(),
            ];
        }, $dettes);
        return new JsonResponse(
            [
                'data' => $data,
                'totalPages' => $totalPages,
                'currentPage' => $page,
            ],

            Response::HTTP_OK
        );
    }

    #[Route('api/dettes/store', name: 'create_dette', methods: ['POST'])]
    public function createDette(
        Request $request,
        SessionInterface $session,
        EntityManagerInterface $entityManager,
        ClientRepository $clientRepository,
        ArticleRepository $articleRepository
    ): JsonResponse {

        $panier = $session->get('panier', []);

        $clientId = $request->get('client_id');

        if (empty($panier)) {
            return new JsonResponse(['message' => 'Le panier est vide'], Response::HTTP_BAD_REQUEST);
        }

        $client = $clientRepository->find($clientId);

        if (!$client) {
            return new JsonResponse(['message' => 'Client non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $montantTotal = 0;
        $details = [];

        foreach ($panier as $item) {
            $article = $articleRepository->find($item['idArticle']);
            if (!$article) {
                continue;
            }

            $montantArticle = $item['prix'] * $item['quantite'];
            $montantTotal += $montantArticle;

            $detailDette = new Detail();
            $detailDette->setArticle($article);
            $detailDette->setQteVendu($item['quantite']);
            $detailDette->setMontantVendu($item['total']);
            $details[] = $detailDette;
        }


        $dette = new Dette();
        $dette->setMontant($montantTotal);
        $dette->setMontantVerser(0);
        $dette->setClient($client);
        $entityManager->persist($dette);
        $entityManager->flush();

        foreach ($details as $detail) {
            $detail->setDette($dette);
            $entityManager->persist($detail);
        }


        $entityManager->flush();


        $session->remove('panier');

        return new JsonResponse(
            [
                'message' => 'Dette créée avec succès',
                'dette_id' => $dette->getId()
            ],
            Response::HTTP_CREATED
        );
    }
}