from django.shortcuts import render
from django.http import JsonResponse
import psycopg2
from decouple import config

import os

from django.http import HttpResponse


# TODO zobraz len školy v dobrých lokalitách podľa kriminality

def my_image(request, image):
    image_data = open('/'.join(os.path.abspath(__file__).split('/')[:-2]) + "/assets/icons/" + image + ".png",
                      "rb").read()

    return HttpResponse(image_data, content_type="image/png")


def get_church(request, save):
    conn = psycopg2.connect(host=config("DB_HOST"), dbname=config("DB_NAME"), user=config("DB_USER"),
                            password=config("DB_PASSWORD"))
    cur = conn.cursor()

    if save == '1':
        save_query = "AND bostons.crime > 0.9"
    else:
        save_query = ''

    geojson = []

    cur.execute("WITH churches as ("
                "SELECT plt.name, plt.way "
                "FROM planet_osm_polygon as plt "
                "LEFT JOIN bostons on plt.region = bostons.id "
                "WHERE amenity='place_of_worship' and religion='christian' and building='church' " + save_query + " ) "
                                                                                                                  "SELECT json_build_object( "
                                                                                                                  "    'type',       'Feature', "
                                                                                                                  "        'properties', json_build_object( "
                                                                                                                  "            'name', name"
                                                                                                                  "         ), "
                                                                                                                  "    'geometry',   ST_AsGeoJson(ST_PointOnSurface(st_transform(way, 4326)), 4326)::json "
                                                                                                                  " "
                                                                                                                  ") "
                                                                                                                  "FROM churches")

    for row in cur.fetchall():
        geojson.append(row[0])

    conn.close()
    geojson = {"type": "FeatureCollection", "features": geojson}
    return JsonResponse(geojson, safe=False)


def get_school(request, save):
    conn = psycopg2.connect(host=config("DB_HOST"), dbname=config("DB_NAME"), user=config("DB_USER"),
                            password=config("DB_PASSWORD"))
    cur = conn.cursor()

    if save == '1':
        save_query = "AND bostons.crime > 0.9"
    else:
        save_query = ''
    geojson = []

    cur.execute("WITH schools as ("
                "SELECT plt.name, plt.way "
                "FROM planet_osm_polygon as plt "
                "LEFT JOIN bostons on plt.region = bostons.id "
                "WHERE amenity='school' " + save_query + " ) "
                                                         "SELECT json_build_object( "
                                                         "    'type',       'Feature', "
                                                         "    'properties', json_build_object( "
                                                         "       'name', name "
                                                         "    ), "
                                                         "    'geometry',   ST_AsGeoJson(ST_PointOnSurface(st_transform(way, 4326)), 4326)::json "
                                                         " "
                                                         ") "
                                                         "FROM schools")

    for row in cur.fetchall():
        geojson.append(row[0])

    conn.close()
    geojson = {"type": "FeatureCollection", "features": geojson}
    return JsonResponse(geojson, safe=False)


def index(request):
    return render(request, 'index.html')


def get_restaurants(request, save):
    conn = psycopg2.connect(host=config("DB_HOST"), dbname=config("DB_NAME"), user=config("DB_USER"),
                            password=config("DB_PASSWORD"))
    cur = conn.cursor()
    if save == '1':
        save_query = "AND bostons.crime > 0.9"
    else:
        save_query = ''
    geojson = []

    cur.execute("WITH restaurants as ("
                "SELECT plt.name, plt.way "
                "FROM planet_osm_polygon as plt "
                "LEFT JOIN bostons on plt.region = bostons.id "
                "WHERE amenity='restaurant' " + save_query + "UNION ALL "
                                                             "SELECT plt.name, plt.way "
                                                             "FROM planet_osm_point as plt "
                                                             "LEFT JOIN bostons on plt.region = bostons.id "
                                                             "WHERE amenity='restaurant' " + save_query + " ) "
                                                                                                          "SELECT json_build_object( "
                                                                                                          "    'type',       'Feature', "
                                                                                                          "    'properties', json_build_object( "
                                                                                                          "       'name', name "
                                                                                                          "    ), "
                                                                                                          "    'geometry',   ST_AsGeoJson(ST_PointOnSurface(st_transform(way, 4326)), 4326)::json "
                                                                                                          " "
                                                                                                          ") "
                                                                                                          "FROM restaurants")

    for row in cur.fetchall():
        geojson.append(row[0])

    conn.close()
    geojson = {"type": "FeatureCollection", "features": geojson}
    return JsonResponse(geojson, safe=False)


def get_crimes(request):
    conn = psycopg2.connect(host=config("DB_HOST"), dbname=config("DB_NAME"), user=config("DB_USER"),
                            password=config("DB_PASSWORD"))
    cur = conn.cursor()

    geojson = []

    cur.execute("SELECT json_build_object("
                "'type',       'Feature',"
                "'id',         id,"
                "'properties', json_build_object("
                "    'descriptopm', offence_description,"
                "    'score', 0.3"
                "),"
                "'geometry', json_build_object("
                "    'type', 'Point',"
                "    'coordinates', json_build_array(long, lat)"
                ")"
                ")"
                "FROM crimes")

    for row in cur.fetchall():
        geojson.append(row[0])

    conn.close()
    geojson = {"type": "FeatureCollection", "features": geojson}
    return JsonResponse(geojson, safe=False)


def get_data(request):
    geojson = {"type": "FeatureCollection", "features": [
        {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-71.05964817, 42.35945371]}}]}
    return JsonResponse(geojson)


def get_subregions(request, population, crime, parks, school, church, restaurant):
    list_features = {'population': population, 'crime': crime, 'park': parks, 'school': school, 'church': church,
                     'restaurant': restaurant}

    conn = psycopg2.connect(host=config("DB_HOST"), dbname=config("DB_NAME"), user=config("DB_USER"),
                            password=config("DB_PASSWORD"))
    cur = conn.cursor()

    geojson = []
    lent = 0
    final_score = '(0'
    for feature in list_features:
        if list_features[feature] == '1':
            final_score += '+' + feature
            lent += 1

    final_score += ") / " + str(lent)
    print(final_score)
    cur.execute("SELECT json_build_object("
                "'type',       'Feature',"
                "'id',         id,"
                "'properties', json_build_object("
                "   'population', population,"
                "   'crime', crime,"
                "   'name', region,"
                "   'parks', park,"
                "   'restaurants', restaurant,"
                "   'schools', school,"
                "   'churchs', church,"
                "   'final_score', " + str(final_score) + "),"
                                                          "   'geometry',   ST_AsGeoJson(way, 4326)::json"
                                                          ")"
                                                          "FROM bostons "
                                                          "WHERE region != 'ALL';")

    for row in cur.fetchall():
        geojson.append(row[0])
    conn.close()
    geojson = {"type": "FeatureCollection", "features": geojson}
    return JsonResponse(geojson, safe=False)
