ssh watchdoge
sudo su - datapass 

#pour le staging
cd /opt/apps/datapass_staging-backend/current
bundle exec rails c -e production


# pour la prod
cd /opt/apps/datapass_production-backend/current
bundle exec rails c -e production