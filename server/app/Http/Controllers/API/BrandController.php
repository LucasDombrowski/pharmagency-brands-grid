<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Rules\CheckParsedBrandName;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @tags Brands
 */

class BrandController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(["index", "show"]);
    }

    /**
     * Searching brands
     * 
     * ## Example
     * ```
     * https://data.catalogues-pharmagency.fr/api/brands?query="Lorem Ipsum"&validated=1&limit=10&code=59&page=2
     * ```
     * @unauthenticated
     */

    public function index(Request $request)
    {
        $request->validate([
            /**
             * The current search query, which will be parsed into the correct naming format.
             * Example: "***Lorem Ipsum***" will be interpreted as "***lorem-ipsum***".
             */
            "query" => "nullable|string",

            /**
             * Filter by the validation status of the brand. The value must be 0 or 1.
             */
            "validated" => "nullable|boolean",

            /**
             * Paginate the results according to this value.
             */
            "limit" => "nullable|integer",

            /**
             * Sort the results by a specific client department code.
             */
            "code" => "nullable|integer|digits:2",

            /**
             * The current pagination page.
             */
            "page" => "nullable|integer"
        ]);

        // Start building the query for brands
        $query = Brand::query();

        // Apply filters based on request parameters

        // Filter by search query
        if ($request->filled("query")) {
            $query->where("name", "like", "%" . parseBrandName($request->input("query")) . "%")
                ->orderByRaw(
                    "CASE WHEN name LIKE ? THEN 1 WHEN name LIKE ? THEN 2 ELSE 3 END",
                    [$request->input("query"), $request->input("query") . "%"]
                );
        }

        // Filter by validation status
        if ($request->filled("validated")) {
            $query->where("validated", $request->input("validated"));
        }

        // Apply pagination limit
        if ($request->filled("limit")) {
            $query->take($request->input("limit"));
        }

        // Apply pagination offset (if provided)
        if ($request->filled("offset")) {
            $query->skip($request->input("offset"));
        }

        // Sort by client department code count (if 'code' parameter is provided)
        if ($request->filled("code")) {
            $code = $request->input("code");
            $query->withCount([
                'categories' => function ($query) use ($code) {
                    $query->whereHas('client', function ($query) use ($code) {
                        $query->where('departmentCode', $code);
                    });
                }
            ])->orderBy("categories_count", "desc");
        } else {
            // Default sort by category count
            $query->withCount("categories")->orderBy("categories_count", "desc");
        }

        // Retrieve paginated results
        $results = $query->paginate($request->input("limit", 10)); // Default limit of 10 per page

        /**
         * Returns the results sorted by their occurrences in the client's categories.
         * If the "code" field is set, the occurrences will be determined only with clients
         * that have the same given department code.
         * The results are paginated by the "limit" input. If it is not set, the pagination limit
         * is set to a default value of 10.
         *
         * @body array{
         *     current_page: integer,
         *     data: array{id: int, name: string, png_url: string|null, jpg_url: string|null, validated: true},
         *     first_page_url: string,
         *     from: integer,
         *     last_page: integer,
         *     last_page_url: string,
         *     links: array{
         *         array{url: string|null, label: string, active: bool}
         *     },
         *     next_page_url: string|null,
         *     path: string,
         *     per_page: integer,
         *     prev_page_url: string|null,
         *     to: integer,
         *     total: integer
         * }
         */
        return response()->json($results);
    }


    /**
     * Add a brand to the database.
     * 
     * By this way, the brand will be instantly a valid one at its creation.
     */
    public function store(Request $request)
    {
        $request->validate([
            //The brand name, it must be unique. The value will be parsed into the correct naming format.
            "name" => ["required", "string", new CheckParsedBrandName],
            /**
             * The image url, it has to be a png or jpg file.
             * @example https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png
             */
            "url" => "required|url",
        ]);

        $brandData = [
            "name" => parseBrandName($request->input("name")),
            "validated" => true
        ];
        $url = $request->input("url");
        $extension = pathinfo($url, PATHINFO_EXTENSION);
        if (str_starts_with($extension, "png")) {
            $brandData["png_url"] = $url;
        } else if (str_starts_with($extension, "jpg") || str_starts_with($extension, "jpeg")) {
            $brandData["jpg_url"] = $url;
        } else {
            return
                /**
                 * Error thrown when the image link leads to an incorrect extension.
                 * @status 415
                 */
                response()->json(["message" => "The image link is not in png or jpg"], 415);
        }
        $brand = Brand::create($brandData);

        return
            /**
             * Returns the created brand
             * @body array{id: int, name: string, png_url: string|null, jpg_url: string|null, validated: true}
             */
            response()->json($brand, 201);
    }

    /**
     * Find a specific brand
     * @unauthenticated
     */
    public function show(Brand $brand)
    {
        return
            /**
             * Returns the brand which has the given id in the database.
             * @body array{id: int, name: string, png_url: string|null, jpg_url: string|null, validated: bool}
             */
            response()->json($brand);
    }

    /**
     * Update a specific brand data.
     */
    public function update(Request $request, Brand $brand)
    {
        $request->validate([
            //The brand name, it must be unique. The value will be parsed into the correct naming format.
            "name" => ["required", "string", new CheckParsedBrandName($brand)],
            /**
             * The image url, it has to be a png or jpg file.
             * @example https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png
             */
            "url" => "required|url",
            //A boolean value which indicate if the brand is valid or not.
            "validated" => "nullable|boolean"
        ]);

        $brandData = [
            "name" => parseBrandName($request->input("name")),
            "validated" => $request->input("validated", 0)
        ];

        $url = $request->input("url");

        $extension = pathinfo($url, PATHINFO_EXTENSION);

        if (str_starts_with($extension, "png")) {
            $brandData["png_url"] = $url;
        } else if (str_starts_with($extension, "jpg") || str_starts_with($extension, "jpeg")) {
            $brandData["jpg_url"] = $url;
        } else {
            return
                /**
                 * Error thrown when the image link leads to an incorrect extension.
                 * @status 415
                 */
                response()->json(["message" => "The image link is not in png or jpg"], 415);
        }
        $brand->update($brandData);
        return
            /**
             * Returns the updated brand
             * @body array{id: int, name: string, png_url: string|null, jpg_url: string|null, validated: bool}
             */
            response()->json($brand);
    }

    /**
     * Delete a specific brand from the database.
     */
    public function destroy(Brand $brand)
    {
        $categories = $brand->categories;
        foreach ($categories as $category) {
            $count = 1;
            foreach ($category->brands as $categoryBrand) {
                if ($categoryBrand->id !== $brand->id) {
                    $category->brands()->updateExistingPivot($categoryBrand, ["order" => $count]);
                    $count++;
                }
            }
        }
        $brand->categories()->detach();
        $brand->delete();
        return
            /**
             */
            response("", 204);
    }
}
