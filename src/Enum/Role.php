<?php

namespace App\Enum;

enum Role: string
{
    case Admin = 'admin';
    case Boutiquier = 'boutiquier';
    case Client = 'client';

    public static function getRoles(): array
    {
        return array_map(fn(self $role) => $role->value, self::cases());
    }
}