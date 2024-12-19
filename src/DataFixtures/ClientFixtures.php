<?php

namespace App\DataFixtures;

use App\Entity\Client;
use App\Entity\Dette;
use App\Entity\Users;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ClientFixtures extends Fixture
{
    private $encoder;

    public function __construct(UserPasswordHasherInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager): void
    {

        for ($i = 0; $i < 10; $i++) {
            $client = new Client();
            $client->setTelephone('77123456' . $i);
            $client->setSurnom('surnom' . $i);
            $client->setAdresse('adresse' . $i);
            if ($i % 2 == 0) {
                $user = new Users();
                $user->setNom("nom" . $i);
                $user->setPrenom("Prenom" . $i);
                $user->setLogin("login" . $i);
                $plaintextPassword = "passer";

                // hash the password (based on the security.yaml config for the $user class)
                $hashedPassword = $this->encoder->hashPassword(
                    $user,
                    $plaintextPassword
                );
                $user->setPassword($hashedPassword);

                $role = ($i % 4 == 0) ? ["admin"] : ["boutiquier"];

                $user->setRoles($role);

                $client->setUsers($user);

                // creation dette
                for ($j = 1; $j < 3; $j++) {
                    $dette = new Dette();
                    $dette->setMontant(1500 * $j);
                    $dette->setMontantVerser(1500 * $j);
                    $dette->setClient($client);
                    $client->addDette($dette);
                }
            } else {
                for ($j = 1; $j < 3; $j++) {
                    $dette = new Dette();
                    $dette->setMontant(1500 * $j);
                    $dette->setMontantVerser(1500);
                    $dette->setClient($client);
                    $client->addDette($dette);
                }
            }
            $manager->persist($client);
        }

        $manager->flush();
    }
}