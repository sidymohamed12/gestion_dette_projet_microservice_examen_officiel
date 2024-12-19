<?php

namespace App\Controller;

use App\Entity\Client;
use App\Entity\Dette;
use App\Entity\Users;
use App\Enum\Role;
use App\Repository\ClientRepository;
use App\Repository\DetteRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints\Json;

class ClientController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private $encoder;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $encoder)
    {
        $this->entityManager = $entityManager;
        $this->encoder = $encoder;
    }
    #[Route('/clients', name: 'app_client')]
    public function index(): Response
    {
        $html = file_get_contents("/home/sms_12/gestion_dette_projet_microservice/Views/Client/index.html");
        return new Response($html);
    }

    #[Route('api/clients', name: 'api_clients', methods: ['GET'])]
    public function list(Request $request, ClientRepository $clientRepository): JsonResponse
    {
        $limit = 5;
        $page = (int) $request->query->get('page', 1);
        $offset = ($page - 1) * $limit;
        $totalClients = $clientRepository->count([]);
        $totalPages = (int) ceil($totalClients / $limit);
        $clients = $clientRepository->findBy([], null, $limit, $offset);

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

        return new JsonResponse([
            "data" => $data,
            'totalPages' => $totalPages,
            'currentPage' => $page,
        ], Response::HTTP_OK);
    }

    #[Route('/clients/form', name: 'add_client')]
    public function form(): Response
    {
        $html = file_get_contents("/home/sms_12/gestion_dette_projet_microservice/Views/Client/form.html");
        return new Response($html);
    }

    #[Route('/api/clients/store', name: 'create_client', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $file = $request->files->get("image");
        $data = $request->request->all();

        // Validate required fields
        if (empty($data['surnom']) || empty($data['telephone']) || empty($data['adresse'])) {
            return new JsonResponse(['error' => 'Les champs surnom, téléphone et adresse sont obligatoires.'], Response::HTTP_BAD_REQUEST);
        }

        // Create Client
        $client = new Client();
        $client->setSurnom($data['surnom']);
        $client->setTelephone($data['telephone']);
        $client->setAdresse($data['adresse']);

        // Check if user data is provided
        if (!empty($data['prenom']) || !empty($data['nom']) || !empty($data['login']) || !empty($data['password'])) {
            // Validate required user fields
            if (empty($data['login']) || empty($data['password'])) {
                return new JsonResponse(['error' => 'Les champs login et password sont obligatoires pour créer un compte utilisateur.'], Response::HTTP_BAD_REQUEST);
            }

            $user = new Users();
            $user->setPrenom($data['prenom'] ?? null);
            $user->setNom($data['nom'] ?? null);
            $user->setLogin($data['login']);
            $user->setPassword(password_hash($data['password'], PASSWORD_BCRYPT));
            $user->setRoles([Role::Client]);
            if ($file) {
                try {
                    $newFilename = $file->getClientOriginalName();
                    $file->move("/home/sms_12/gestion_dette_projet_microservice/public/image/Users/", $newFilename);
                    $user->setImage($newFilename);
                } catch (\Throwable $th) {
                    throw $th;
                }
            }

            $client->setUsers($user);
        }

        try {
            $this->entityManager->persist($client);
            $this->entityManager->flush();
        } catch (UniqueConstraintViolationException $e) {
            return new JsonResponse(['error' => 'Le surnom ou le téléphone est déjà utilisé.'], Response::HTTP_CONFLICT);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Une erreur est survenue lors de l\'enregistrement.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(
            [
                'message' => 'Client créé avec succès.',
                'id' => $client->getId(),
            ],
            Response::HTTP_CREATED
        );
    }

    #[Route('/clients/id={id}', name: 'detail_client')]
    public function detail(): Response
    {
        $html = file_get_contents("/home/sms_12/gestion_dette_projet_microservice/Views/Client/dette.client.html");
        return new Response($html);
    }

    #[Route('api/clients/id={id}', name: 'dette_client')]
    public function getDetailClient(ClientRepository $clientRepository, DetteRepository $detteRepository, $id): JsonResponse
    {
        $client = $clientRepository->find($id);

        if (!$client) {
            return new JsonResponse(['error' => 'Client not found'], Response::HTTP_NOT_FOUND);
        }

        $dettes = $detteRepository->findDetteClient($client);

        $data = [
            'id' => $client->getId(),
            'surnom' => $client->getSurnom(),
            'telephone' => $client->getTelephone(),
            'adresse' => $client->getAdresse(),
            'nom' => $client->getUsers()?->getNom(),
            'prenom' => $client->getUsers()?->getPrenom(),
            'login' => $client->getUsers()?->getLogin(),
            'image' => $client->getUsers()?->getImage() ?? null,
            'dettes' => []
        ];

        foreach ($dettes as $dette) {
            $data['dettes'][] = [
                'id' => $dette->getId(),
                'montant' => $dette->getMontant(),
                'montantVerser' => $dette->getMontantVerser(),
                'isArchiver' => $dette->isisArchiver(),
                'date' => $dette->getDate()->format('Y-m-d H:i:s'),
                'etat' => $dette->getEtat()->name,
            ];
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }
}