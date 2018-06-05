import praw
import sys
import os

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
	docs_dir = "docs"
	original_dir = os.path.join(os.getcwd(), os.path.join(docs_dir, "original"))
	print(original_dir)
	reddit = praw.Reddit(client_id = client_id, client_secret = client_secret, password = password, user_agent = user_agent, username = username)
	index = 1
	for comment in reddit.subreddit('all').comments(limit=300):
		out_file = open(os.path.join(original_dir, str(index) + ".txt"), "w", encoding="utf-8")
		out_file.write(comment.body)
		out_file.close()
		index += 1