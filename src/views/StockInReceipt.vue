<template>
<div class="receipt">
	<loading :loading="isLoading" />
  <div class="invoice-box" v-if="stock_in">
    <table cellpadding="0" cellspacing="0">
      <tr class="top">
        <td colspan="5">
          <table>
            <tr>
              <td class="title">
								<div class="brand">
									<h1 class="logo"><a><span>REDE</span> de <strong>sementes</strong></a></h1>
								</div>

              </td>

              <td>
								<h4><strong>Recibo de entrega</strong></h4>
                Data: {{stock_in.createdAt | moment("DD/MM/YYYY H:mm")}}<br>
								Cód: <small>{{stock_in._id}}</small><br>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr class="information">
        <td colspan="5">
          <table>
            <tr>
              <td>
                <strong>Recebido por:</strong><br>
								<span v-if="stock_in.seeds_house">{{stock_in.seeds_house.name}}<br></span>
								<span v-if="stock_in.createdBy">{{stock_in.createdBy.name}}<br></span>
              </td>

              <td>
                <strong>Entregue por:</strong><br>
                <span v-if="stock_in.collectors_group">{{stock_in.collectors_group.name}}<br></span>
                <span v-if="stock_in.collector">{{stock_in.collector.name}}<br></span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr class="heading">
        <td>Espécie</td>
        <td>Lote</td>
				<td>Valor/kg</td>
        <td>Quantidade</td>
        <td>Total</td>
      </tr>
      <tr class="details" v-for="(stock_item, index) in stock_in.stock_items">
        <td>
					{{stock_item.seed.name}}
					<small v-if="stock_item.number_of_matrixes"><br>{{stock_item.number_of_matrixes}} matrizes</small>
					<small v-if="stock_item.collection_date"><br>Colhido em {{stock_item.collection_date | moment("DD/MM/YYYY")}}</small>
				</td>
        <td><small>{{stock_item.lot.code}}</small></td>
				<td>{{stock_item.compensation_collect | moeda}}</td>
        <td>{{stock_item.qtd | kg}}</td>
        <td>{{stock_item.compensation_collect * stock_item.qtd | moeda}}</td>
      </tr>
      <tr class="total">
        <td></td>
        <td></td>
        <td>Total:</small></td>
        <td>{{sumArray(stock_in.stock_items, 'qtd') | kg }}</td>
        <td>{{sumArray(stock_in.stock_items, 'compensation_collect', 'qtd') | moeda }}</td>
      </tr>
    </table>
		<div class="signature">
			<p v-if="stock_in.collector">{{stock_in.collector.name}}<br></p>
			<p v-if="stock_in.collectors_group">{{stock_in.collectors_group.name}}<br></p>
		</div>

  </div>
</div>
</template>
<script>
import axios from 'axios'
import Loading from '@/components/Loading'

export default {

  name: 'StockInReceipt',

  data() {
    return {
      stock_in: null
    }
  },
  created() {
    this.isLoading = true
    axios.get('stock_in/' + this.$route.params.id, {
      params: {
        populate: 'seeds_house collectors_group collector stock_items.seed stock_items.lot createdBy'
      }
    }).then(response => {
      this.stock_in = response.data
      this.isLoading = false
			setTimeout(() => {
				// window.print();
			}, 2000);
    }).catch(this.showError);
  },
  components: {
    'loading': Loading,
  }

};
</script>
