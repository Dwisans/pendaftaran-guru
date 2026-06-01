<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int $user_id
 * @property string $phone
 * @property string $address
 * @property string $education
 * @property int $experience_years
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Application> $applications
 * @property-read int|null $applications_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Applicant newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Applicant newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Applicant query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Applicant whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Applicant whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Applicant whereEducation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Applicant whereExperienceYears($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Applicant whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Applicant wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Applicant whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Applicant whereUserId($value)
 */
	class Applicant extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $applicant_id
 * @property int $job_opening_id
 * @property string $status
 * @property string|null $hrd_notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Applicant $applicant
 * @property-read \App\Models\JobOpening $jobOpening
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Application newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Application newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Application query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Application whereApplicantId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Application whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Application whereHrdNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Application whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Application whereJobOpeningId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Application whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Application whereUpdatedAt($value)
 */
	class Application extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $location
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\JobOpening> $jobOpenings
 * @property-read int|null $job_openings_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Branch whereUpdatedAt($value)
 */
	class Branch extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $applicant_id
 * @property string $document_type
 * @property string $file_path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Document newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Document newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Document query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Document whereApplicantId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Document whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Document whereDocumentType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Document whereFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Document whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Document whereUpdatedAt($value)
 */
	class Document extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string $description
 * @property string $requirements
 * @property int $branch_id
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Branch $branch
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JobOpening newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JobOpening newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JobOpening query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JobOpening whereBranchId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JobOpening whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JobOpening whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JobOpening whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JobOpening whereRequirements($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JobOpening whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JobOpening whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JobOpening whereUpdatedAt($value)
 */
	class JobOpening extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string|null $password
 * @property string|null $google_id
 * @property string $role
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Applicant|null $applicant
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereGoogleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

