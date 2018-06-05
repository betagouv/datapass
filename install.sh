#!/bin/sh

ansible-playbook -i inventories/sandbox/hosts configure.yml
ansible-playbook deploy-oauth.yml -i inventories/sandbox/hosts
ansible-playbook deploy-back.yml -i inventories/sandbox/hosts
