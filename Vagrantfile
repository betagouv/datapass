# -*- mode: ruby -*-
# vi: set ft=ruby :

vms = {
  :signup =>
  {
    :ip => '192.168.56.125',
    :alternate_ips => [],
    :memory => '1024',
    :autostart => true,
    :name => 'signup-development',
  }
}

ssh_pubkey = File.read(File.join(Dir.home, '.ssh', 'id_rsa.pub')).chomp

Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-16.04"
  config.vm.synced_folder ".", "/vagrant", disabled: true

  config.vm.provision 'shell', inline: <<-SHELL
    sudo mkdir -p /home/vagrant/.ssh -m 700
    sudo echo '#{ssh_pubkey}' >> /home/vagrant/.ssh/authorized_keys
  SHELL

  config.ssh.insert_key = false

  config.vm.provider "virtualbox" do |v|
    v.cpus = 1
    v.gui = false
  end

  vms.each_pair do |key, vm|
    autostart = vm[:autostart]
    config.vm.define key, autostart: autostart do |configvm|

      configvm.vm.network 'private_network', ip: vm[:ip]

      configvm.vm.provider 'virtualbox' do |vb|
        vb.memory = vm[:memory] || '512'
        vb.name = vm[:name]
      end
    end
  end
end
