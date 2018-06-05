import praw
import sys

args = sys.argv
len = len(args)

if(len != 6):
	print("Make sure to have a client id, client secret, password, user agent and username")
else:
	client_id = args[1]
	client_secret = args[2]
	password = args[3]
	user_agent = args[4]
	username = args[5]
	
	reddit = praw.Reddit(client_id = client_id, client_secret = client_secret, password = password, user_agent = user_agent, username = username)
	