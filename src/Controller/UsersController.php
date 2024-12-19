<?php

namespace App\Controller;

use App\Entity\Users;
use App\Enum\Role;
use App\Repository\UsersRepository;
use Doctrine\ORM\EntityManagerInterface;
use PhpParser\Node\Stmt\Return_;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class UsersController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private $encoder;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $encoder)
    {
        $this->entityManager = $entityManager;
        $this->encoder = $encoder;
    }

    #[Route('/users', name: 'app_users')]
    public function index(): Response
    {
        $html = file_get_contents("/home/sms_12/gestion_dette_projet_microservice/Views/Users/index.html");
        return new Response($html);
    }

    #[Route('api/users', name: 'api_users', methods: ['GET'])]
    public function list(UsersRepository $usersRepository): JsonResponse
    {
        $users = $usersRepository->findAll();

        $data = array_map(function (Users $user) {
            return [
                'id' => $user->getId(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
                'login' => $user->getLogin(),
                'role' => $user->getRoles(),
                'image' => $user->getImage()
            ];
        }, $users);

        return new JsonResponse($data, Response::HTTP_OK);
    }

    #[Route('/users/form', name: 'get_user', methods: ['GET'])]
    public function getForm(): Response
    {
        $html = file_get_contents("/home/sms_12/gestion_dette_projet_microservice/Views/Users/form.html");
        return new Response($html);
    }

    #[Route('/api/roles', name: 'get_role', methods: ['GET'])]
    public function getRoles(): JsonResponse
    {
        $roles = Role::getRoles();
        return new JsonResponse($roles, Response::HTTP_OK);
    }

    #[Route('/api/users/store', name: 'create_user', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $file = $request->files->get('image');
        if (!isset($data['nom'], $data['prenom'], $data['login'], $data['password'], $data['role'])) {
            return new JsonResponse(['error' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }

        $user = new Users();
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);
        $user->setLogin($data['login']);
        $user->setPassword($this->encoder->hashPassword($user, $data['password']));
        $user->setRoles([$data['role']]);
        if ($file) {
            try {
                $newFilename = $file->getClientOriginalName();
                $file->move("/home/sms_12/gestion_dette_projet_microservice/public/image/Users/", $newFilename);
                $user->setImage($newFilename);
            } catch (\Throwable $th) {
                throw $th;
            }
        }
        $user->setImage($file);
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(
            [
                'message' => 'User created successfully',
                'id' => $user->getId()
            ],
            Response::HTTP_CREATED
        );
    }
}