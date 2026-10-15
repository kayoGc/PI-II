# 📋 Regras de Negócio - Dádiva Aromaterapia & Aromacologia

Este documento estabelece as diretrizes lógicas, restrições e comportamentos esperados do sistema para a plataforma de e-commerce da Dádiva Aromaterapia.

---

## 🌿 1. Autenticação e Perfis de Usuário (Auth & Roles)

* **RN01 - Acesso Restrito ao Painel Administrativo:** 
  * O painel de gestão (`/admin`) e as rotas de alteração de catálogo/configurações devem ser estritamente protegidos. 
  * Apenas usuários autenticados com o perfil de administrador (`role: 'admin'`) podem acessar e modificar dados estruturais.
* **RN02 - Cadastro de Clientes (Varejo):** 
  * Qualquer usuário externo pode criar uma conta de cliente (`/register`) informando Nome Completo, E-mail válido (validado via Expressão Regular / Regex) e Senha (com no mínimo 6 caracteres). 
  * O papel padrão atribuído a novos cadastros será sempre `role: 'customer'`.

---

## 🛍️ 2. Catálogo e Vitrine de Produtos (Catalog)

* **RN03 - Exibição de Produtos:** 
  * Os produtos cadastrados devem ser exibidos na página inicial (`/`) de forma responsiva. 
  * Cada item exibido deve conter obrigatoriamente: Nome, Descrição curta, Preço formatado em Reais (BRL), Categoria e Imagem ilustrativa.
* **RN04 - Filtro por Categoria:** 
  * O cliente deve conseguir filtrar os produtos instantaneamente através de botões de categoria dinâmicos (ex: *Aromaterapia*, *Aromatização*, *Cuidados Pessoais*), além da opção de visualizar "Todas".

---

## 🛒 3. Carrinho de Compras e Orçamento (Cart)

* **RN05 - Gestão de Itens no Carrinho:** 
  * O cliente pode adicionar múltiplos produtos ao carrinho, alterar quantidades ou remover itens indesejados antes de fechar o pedido.
* **RN06 - Cálculo do Total:** 
  * O valor total da compra deve ser recalculado dinamicamente somando a quantidade de cada item multiplicada pelo seu respectivo preço unitário.

---

## 💬 4. Checkout via WhatsApp (Core Business)

* **RN07 - Geração de Link de Encomenda:** 
  * Como a plataforma opera no modelo de catálogo digital focado em conversão direta e sem intermediação de gateways de pagamento caros, o fechamento do pedido **não** processa pagamentos online no site. 
* **RN08 - Formatação da Mensagem:** 
  * Ao finalizar a compra, o sistema deve consolidar os dados do carrinho (nome dos produtos, quantidade e valor total) em um texto estruturado, codificá-lo e abrir automaticamente o aplicativo do WhatsApp com um link direcionado para o número de atendimento da Dádiva Aromaterapia.

---

## ⚙️ 5. Gestão Administrativa (Admin CRUD)

* **RN09 - Gerenciamento de Catálogo:** 
  * O administrador deve ter permissão para cadastrar novos produtos, editar informações existentes (preço, descrição, estoque) e remover itens do catálogo de forma simples e intuitiva.
* **RN10 - Configuração de Mensagens:** 
  * O administrador deve poder alterar o texto padrão da mensagem enviada ao WhatsApp da loja através do painel de controle administrativo.