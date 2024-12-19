<?php

namespace App\Enum;

enum Etat: string
{
    case Encours = 'encours';
    case Refuser = 'refuser';
    case Accepter = 'accepter';

    /**
     * Retourne la liste des rôles sous forme de tableau.
     */
    public static function getEtats(): array
    {
        return array_map(fn(self $etat) => $etat->value, self::cases());
    }
}