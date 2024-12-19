<?php

namespace App\DataFixtures;

use App\Entity\Article;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ArticleFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i < 10; $i++) {
            $article = new Article();
            $article->setLibelle("article_" . $i);
            $article->setQteStock($i * 5);
            $article->setPrix(1000 * $i);
            $manager->persist($article);
        }

        $manager->flush();
    }
}