from bs4 import BeautifulSoup
import urllib2
import time, random, re
import yelppy
import pprint

def yelpSearchEvanston():
    all_biz = []
    for i in range(5):
        response = yelppy.search("restaurants", "Evanston, IL", i*20, 3200)
        businesses = response.get('businesses')
 
        if not businesses:
            print u'No businesses for {0} in {1} found.'.format(term, location)
            return

        for biz in businesses:
            biz_id = biz['id']
            res = yelppy.get_business(biz_id)
            all_biz.append(res)
    return all_biz

def lookForMenu(all_biz):
    biz_with_menu = []
    menu_urls = []
    for biz in all_biz:
        #time.sleep(random.random()*2)
        print "trying to get menu for "+biz['name']
        f = urllib2.urlopen(biz['url'])
        bizPage = f.read()
        soup = BeautifulSoup(bizPage)
        menua = soup.find_all(attrs={"class": "menu-explore"})
        if len(menua) > 0:
            biz_with_menu.append(biz)
            menu_urls.append(str(menua[0]).split('"')[3])
    return biz_with_menu, menu_urls

def scrapeMenu(biz_list, menu_urls):
    menu_pages = []
    for i in range(len(menu_urls)):
        #time.sleep(random.random()*2)
        print "scraping menu from "+biz_list[i]['name']
        f = urllib2.urlopen('http://www.yelp.com'+menu_urls[i])
        menu_pages.append(f.read())
    return menu_pages

def parseMenus(menu_pages):
    parsed_menu_items = []
    for i in range(len(menu_pages)):
        soup = BeautifulSoup(menu_pages[i])
        all_menu_items = soup.find_all(attrs={"class": "media-block"})
        parsed_menu_items.append([])
        for item in all_menu_items:
            item_detail_div = item.find_all(attrs={"class": "menu-item-details"})
            if len(item_detail_div) == 0:
                continue
            item_detail_soup = BeautifulSoup(str(item_detail_div[0]))
            item_price_div = item.find_all(attrs={"class": "menu-item-price-amount"})
            if len(item_price_div) == 0:
                continue
            item_price_soup = BeautifulSoup(str(item_price_div[0]))
            item_name_tag = item_detail_soup.h3
            if item_name_tag.a is not None:
                for name in item_name_tag.a.stripped_strings:
                    item_name = name
            else:
                for name in item_name_tag.stripped_strings:
                    item_name = name
            item_desc_tag = item_detail_soup.p
            if item_desc_tag is not None:
                for desc in item_desc_tag.stripped_strings:
                    item_desc = desc
            else:
                item_desc = 'no description'
            for price in item_price_soup.stripped_strings:
                item_price = price.strip('$')
            parsed_menu_items[i].append({'name': item_name, 'desc': item_desc, 'price': float(item_price)})
    return parsed_menu_items

def writeMenuCSV(biz_with_menu, parsed_menu_items):
    f = open('evanston-res-menu-table.csv','w')
    f2 = open('evanston-res-list.csv','w')
    f2.write('RestaurantName,url,imge_url\n')
    f.write('ItemName,ItemDesc,ItemPrice,RestaurantName\n')
    for i in range(len(biz_with_menu)):
        for item in parsed_menu_items[i]:
            f.write('"'+item['name'].replace('"','').encode('utf8')+'"'+','+'"'+item['desc'].replace('"','').encode('utf8')+'"'+','+str(item['price'])+','+'"'+biz_with_menu[i]['name'].replace('"','').encode('utf8')+'"'+'\n')
        f2.write('"'+biz_with_menu[i]['name'].replace('"','').encode('utf8')+'"'+','+biz_with_menu[i]['url'].encode('utf8')+','+biz_with_menu[i]['image_url'].encode('utf8')+'\n')


all_biz = yelpSearchEvanston()
biz_with_menu, menu_urls = lookForMenu(all_biz)
menu_pages = scrapeMenu(biz_with_menu, menu_urls)
parsed_menu_items = parseMenus(menu_pages)
writeMenuCSV(biz_with_menu, parsed_menu_items)

