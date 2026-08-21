export interface UserStats {
    recipesCount: number;
    collectionsCount: number;
}

export interface FollowCounts {
    followers: number;
    following: number;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    tier: 'bronze' | 'silver' | 'gold';
}

export function getUserBadges(stats: UserStats, followCounts?: FollowCounts): Badge[] {
    const badges: Badge[] = [];

    // Recipe Badges
    if (stats.recipesCount >= 20) {
        badges.push({
            id: 'master-kuvar',
            name: 'Master Kuvar',
            description: 'Objavljeno 20 ili više recepata.',
            icon: '🥇',
            color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
            tier: 'gold'
        });
    } else if (stats.recipesCount >= 5) {
        badges.push({
            id: 'aktivni-kuvar',
            name: 'Aktivni Kuvar',
            description: 'Objavljeno 5 ili više recepata.',
            icon: '🥈',
            color: 'bg-slate-100 text-slate-700 border-slate-300',
            tier: 'silver'
        });
    } else if (stats.recipesCount >= 1) {
        badges.push({
            id: 'novi-kuvar',
            name: 'Novi Kuvar',
            description: 'Objavljen prvi recept.',
            icon: '🥉',
            color: 'bg-orange-100 text-orange-800 border-orange-300',
            tier: 'bronze'
        });
    }

    // Collection Badges
    if (stats.collectionsCount >= 1) {
        badges.push({
            id: 'kolekcionar',
            name: 'Kolekcionar',
            description: 'Kreirana barem jedna kolekcija.',
            icon: '📚',
            color: 'bg-blue-100 text-blue-700 border-blue-300',
            tier: 'bronze'
        });
    }

    // Follower Badges
    if (followCounts && followCounts.followers >= 10) {
        badges.push({
            id: 'uticajan',
            name: 'Uticajan',
            description: 'Preko 10 pratilaca.',
            icon: '🌟',
            color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
            tier: 'silver'
        });
    }

    return badges;
}
