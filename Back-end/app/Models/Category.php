<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'description',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // --- العلاقات ---

    /**
     * علاقة التصنيف بالمشاريع التي تنتمي إليه.
     * للاستدعاء: $category->projects
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}